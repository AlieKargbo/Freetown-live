import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';

const MAX_PLAYERS = 500;
const MAX_MESSAGE_BYTES = 32 * 1024;
const MAX_DIRECT_MESSAGE_LENGTH = 1000;
const MAX_PENDING_INBOX = 100;
const MAX_COORDINATE = 100;
const USERNAME_PATTERN = /^@?[A-Za-z0-9_]{1,24}$/;
const VECTOR_PATTERN = /^[\w -]{1,100}$/;
const BODIES = new Set(['Woman', 'Man']);
const HAIRSTYLES = new Set(['Braids', 'Afro', 'Bun', 'Ponytail', 'Long', 'Locs', 'Low cut', 'Gele', 'Classic']);
const OUTFITS = new Set(['Casual', 'Office', 'Owambe', 'Site work', 'School', 'Traditional']);
const FABRICS = new Set(['Plain', 'Ankara', 'Adire', 'Aso-oke', 'Kente', 'Lace']);

function validVector(value, nullable = false) {
  return (nullable && value === null)
    || (Array.isArray(value)
      && value.length === 2
      && value.every((coordinate) => Number.isFinite(coordinate) && Math.abs(coordinate) <= MAX_COORDINATE));
}

function validAppearance(value) {
  return Boolean(
    value
      && typeof value === 'object'
      && typeof value.name === 'string'
      && value.name.length <= 24
      && BODIES.has(value.body)
      && HAIRSTYLES.has(value.hairstyle)
      && OUTFITS.has(value.outfit)
      && FABRICS.has(value.fabric)
      && ['skin', 'hairColor', 'accent'].every((key) => typeof value[key] === 'string' && /^#[0-9a-f]{6}$/i.test(value[key])),
  );
}

function validBuildingId(value) {
  return value === null || (typeof value === 'string' && VECTOR_PATTERN.test(value));
}

function publicPlayer(player) {
  return {
    id: player.id,
    name: player.name,
    appearance: player.appearance,
    buildingId: player.buildingId,
    position: player.position,
    target: player.target,
  };
}

function safeSend(socket, message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

export function createRealtimeServer({
  host = '0.0.0.0',
  port = 8787,
  allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'],
} = {}) {
  const players = new Map();
  const sockets = new Map();
  const pendingInbox = new Map();
  const origins = new Set(allowedOrigins);
  const httpServer = createServer((request, response) => {
    if (request.url !== '/health') {
      response.writeHead(404).end('Not found');
      return;
    }

    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok', players: players.size }));
  });
  const webSocketServer = new WebSocketServer({
    server: httpServer,
    maxPayload: MAX_MESSAGE_BYTES,
    verifyClient: ({ origin }) => !origin || origins.has(origin),
  });

  function broadcast(message, except = null) {
    const encoded = JSON.stringify(message);
    for (const client of webSocketServer.clients) {
      if (client !== except && client.readyState === WebSocket.OPEN) {
        client.send(encoded);
      }
    }
  }

  function broadcastToBuilding(message, buildingId, except = null) {
    if (!buildingId) return;
    const encoded = JSON.stringify(message);
    for (const client of webSocketServer.clients) {
      const id = sockets.get(client);
      if (
        client !== except
        && id
        && players.get(id)?.buildingId === buildingId
        && client.readyState === WebSocket.OPEN
      ) {
        client.send(encoded);
      }
    }
  }

  webSocketServer.on('connection', (socket) => {
    let playerId = null;
    let messagesThisSecond = 0;
    const rateLimitTimer = setInterval(() => {
      messagesThisSecond = 0;
    }, 1000);
    rateLimitTimer.unref();

    socket.on('message', (data) => {
      messagesThisSecond += 1;
      if (messagesThisSecond > 30) {
        socket.close(1008, 'Too many updates');
        return;
      }

      let message;
      try {
        message = JSON.parse(data.toString());
      } catch {
        safeSend(socket, { type: 'error', message: 'Invalid JSON message.' });
        return;
      }

      if (!message || typeof message !== 'object' || Array.isArray(message)) {
        safeSend(socket, { type: 'error', message: 'Invalid message shape.' });
        return;
      }

      if (message.type === 'join') {
        if (playerId || typeof message.id !== 'string' || !/^[\w-]{16,64}$/.test(message.id)) {
          safeSend(socket, { type: 'error', message: 'Invalid or duplicate player identity.' });
          return;
        }
        if (players.size >= MAX_PLAYERS || players.has(message.id)) {
          safeSend(socket, { type: 'error', message: 'The multiplayer room is full or this identity is already online.' });
          socket.close(1008, 'Room full or duplicate identity');
          return;
        }
        if (
          typeof message.name !== 'string'
          || !USERNAME_PATTERN.test(message.name)
          || !validAppearance(message.appearance)
          || !validBuildingId(message.buildingId)
          || !validVector(message.position)
          || !validVector(message.target, true)
        ) {
          safeSend(socket, { type: 'error', message: 'Invalid player profile or location.' });
          socket.close(1008, 'Invalid player profile');
          return;
        }

        playerId = message.id;
        const player = {
          id: playerId,
          name: message.name.replace(/^@/, ''),
          appearance: message.appearance,
          buildingId: message.buildingId,
          position: message.position,
          target: message.target,
        };
        players.set(playerId, player);
        sockets.set(socket, playerId);
        safeSend(socket, {
          type: 'snapshot',
          players: [...players.values()].filter((candidate) => candidate.id !== playerId).map(publicPlayer),
        });
        broadcast({ type: 'player', player: publicPlayer(player) }, socket);
        const username = player.name.toLowerCase();
        const pending = pendingInbox.get(username) ?? [];
        for (const inboxMessage of pending) safeSend(socket, inboxMessage);
        pendingInbox.delete(username);
        return;
      }

      if (!playerId) {
        safeSend(socket, { type: 'error', message: 'Join the room before sending updates.' });
        return;
      }

      const current = players.get(playerId);
      if (!current) return;

      if (message.type === 'move') {
        if (!validVector(message.position) || !validVector(message.target, true)) {
          safeSend(socket, { type: 'error', message: 'Invalid movement update.' });
          return;
        }

        const updated = {
          ...current,
          position: message.position,
          target: message.target,
        };
        players.set(playerId, updated);
        broadcastToBuilding({ type: 'player', player: publicPlayer(updated) }, updated.buildingId, socket);
        return;
      }

      if (message.type === 'update') {
        if (
          typeof message.name !== 'string'
          || !USERNAME_PATTERN.test(message.name)
          || !validAppearance(message.appearance)
          || !validBuildingId(message.buildingId)
          || !validVector(message.position)
          || !validVector(message.target, true)
        ) {
          safeSend(socket, { type: 'error', message: 'Invalid player update.' });
          return;
        }

        const updated = {
          ...current,
          name: message.name.replace(/^@/, ''),
          appearance: message.appearance,
          buildingId: message.buildingId,
          position: message.position,
          target: message.target,
        };
        players.set(playerId, updated);
        broadcast({ type: 'player', player: publicPlayer(updated) }, socket);
        return;
      }

      if (message.type === 'direct-message' || message.type === 'payment') {
        const to = typeof message.to === 'string' ? message.to.replace(/^@/, '').toLowerCase() : '';
        const id = typeof message.id === 'string' && /^[\w-]{8,80}$/.test(message.id) ? message.id : '';
        const samePlayer = to === current.name.toLowerCase();
        if (!id || !USERNAME_PATTERN.test(to) || samePlayer) {
          safeSend(socket, { type: 'error', message: 'Choose a valid other player.' });
          return;
        }

        let outgoing;
        if (message.type === 'direct-message') {
          const text = typeof message.text === 'string' ? message.text.trim() : '';
          if (!text || text.length > MAX_DIRECT_MESSAGE_LENGTH) {
            safeSend(socket, { type: 'error', message: `Messages must be 1–${MAX_DIRECT_MESSAGE_LENGTH} characters.` });
            return;
          }
          outgoing = { type: 'direct-message', message: { id, from: current.name, to, text, sentAt: Date.now() } };
        } else {
          const amount = message.amount;
          if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 10_000_000) {
            safeSend(socket, { type: 'error', message: 'Enter a valid in-game payment amount.' });
            return;
          }
          outgoing = { type: 'payment', transfer: { id, from: current.name, to, amount, sentAt: Date.now() } };
        }

        const recipients = [...players.values()].filter((candidate) => candidate.name.toLowerCase() === to);
        if (recipients.length) {
          // A username can have multiple active sessions. Messages reach all of
          // them, while a payment must be applied only once to avoid duplicate credits.
          const deliveryRecipients = message.type === 'payment' ? recipients.slice(0, 1) : recipients;
          for (const recipient of deliveryRecipients) {
            for (const [recipientSocket, recipientId] of sockets) {
              if (recipientId === recipient.id) safeSend(recipientSocket, outgoing);
            }
          }
        } else {
          const inbox = pendingInbox.get(to) ?? [];
          if (inbox.length >= MAX_PENDING_INBOX) inbox.shift();
          inbox.push(outgoing);
          pendingInbox.set(to, inbox);
        }
        safeSend(socket, { type: 'delivery-status', id, to, queued: recipients.length === 0 });
        return;
      }

      safeSend(socket, { type: 'error', message: 'Unsupported message type.' });
    });

    socket.on('close', () => {
      clearInterval(rateLimitTimer);
      const id = sockets.get(socket);
      if (!id) return;
      sockets.delete(socket);
      players.delete(id);
      broadcast({ type: 'left', id });
    });
  });

  const heartbeat = setInterval(() => {
    for (const socket of webSocketServer.clients) {
      if (socket.isAlive === false) {
        socket.terminate();
        continue;
      }
      socket.isAlive = false;
      socket.ping();
    }
  }, 30_000);
  heartbeat.unref();
  webSocketServer.on('connection', (socket) => {
    socket.isAlive = true;
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  return {
    httpServer,
    listen() {
      return new Promise((resolve, reject) => {
        httpServer.once('error', reject);
        httpServer.listen(port, host, () => {
          httpServer.off('error', reject);
          resolve(httpServer.address());
        });
      });
    },
    close() {
      clearInterval(heartbeat);
      for (const socket of webSocketServer.clients) {
        socket.close(1001, 'Server shutting down');
      }
      return new Promise((resolve, reject) => {
        webSocketServer.close((webSocketError) => {
          httpServer.close((httpError) => {
            const error = webSocketError || httpError;
            if (error) reject(error);
            else resolve();
          });
        });
      });
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const server = createRealtimeServer({
    host: process.env.HOST ?? '0.0.0.0',
    port: Number(process.env.PORT ?? 8787),
    allowedOrigins,
  });

  server.listen().then((address) => {
    console.log(`Freetown Life realtime service listening on ${address.address}:${address.port}`);
  }).catch((error) => {
    console.error('Failed to start realtime service:', error);
    process.exitCode = 1;
  });
}
