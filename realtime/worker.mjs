import { DurableObject } from 'cloudflare:workers';

const MAX_PLAYERS = 500;
const MAX_MESSAGE_BYTES = 32 * 1024;
const MAX_DIRECT_MESSAGE_LENGTH = 1000;
const MAX_PENDING_INBOX = 100;
const USERNAME_PATTERN = /^@?[A-Za-z0-9_]{1,24}$/;
const VECTOR_PATTERN = /^[\w -]{1,100}$/;
const BODIES = new Set(['Woman', 'Man']);
const HAIRSTYLES = new Set(['Braids', 'Afro', 'Bun', 'Ponytail', 'Long', 'Locs', 'Low cut', 'Gele', 'Classic']);
const OUTFITS = new Set(['Casual', 'Office', 'Owambe', 'Site work', 'School', 'Traditional']);
const FABRICS = new Set(['Plain', 'Ankara', 'Adire', 'Aso-oke', 'Kente', 'Lace']);

function validVector(value, nullable = false) {
  return (nullable && value === null) || (Array.isArray(value)
    && value.length === 2
    && value.every((coordinate) => Number.isFinite(coordinate) && Math.abs(coordinate) <= 100));
}

function validAppearance(value) {
  return Boolean(value && typeof value === 'object'
    && typeof value.name === 'string' && value.name.length <= 24
    && BODIES.has(value.body) && HAIRSTYLES.has(value.hairstyle)
    && OUTFITS.has(value.outfit) && FABRICS.has(value.fabric)
    && ['skin', 'hairColor', 'accent'].every((key) => typeof value[key] === 'string' && /^#[0-9a-f]{6}$/i.test(value[key])));
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
  try {
    socket.send(JSON.stringify(message));
  } catch {
    // The client may disconnect between selection and send.
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/health') return Response.json({ status: 'ok' });
    if (url.pathname !== '/' && url.pathname !== '/ws') return new Response('Not found', { status: 404 });
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('Expected a WebSocket upgrade.', { status: 426 });
    }

    const origin = request.headers.get('Origin');
    const allowedOrigins = (env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000')
      .split(',').map((item) => item.trim()).filter(Boolean);
    if (origin && !allowedOrigins.includes(origin)) return new Response('Origin is not allowed.', { status: 403 });

    const room = env.REALTIME_ROOM.getByName('freetown-life-global-room');
    return room.fetch(request);
  },
};

export class RealtimeRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sessions = new Map();
    for (const socket of this.ctx.getWebSockets()) {
      const attachment = socket.deserializeAttachment();
      if (attachment) this.sessions.set(socket, attachment);
    }
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  async fetch(request) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    const attachment = { connectionId: crypto.randomUUID(), player: null, windowStartedAt: Date.now(), messageCount: 0 };
    server.serializeAttachment(attachment);
    this.sessions.set(server, attachment);
    return new Response(null, { status: 101, webSocket: client });
  }

  broadcast(message, except = null) {
    for (const socket of this.sessions.keys()) if (socket !== except) safeSend(socket, message);
  }

  broadcastToBuilding(message, buildingId, except = null) {
    if (!buildingId) return;
    for (const [socket, session] of this.sessions) {
      if (socket !== except && session.player?.buildingId === buildingId) safeSend(socket, message);
    }
  }

  async webSocketMessage(socket, raw) {
    let session = this.sessions.get(socket) ?? socket.deserializeAttachment();
    if (!session) return;
    const text = typeof raw === 'string' ? raw : new TextDecoder().decode(raw);
    if (new TextEncoder().encode(text).byteLength > MAX_MESSAGE_BYTES) {
      socket.close(1009, 'Message too large');
      return;
    }
    const now = Date.now();
    const sameWindow = now - session.windowStartedAt < 1000;
    const messageCount = sameWindow ? session.messageCount + 1 : 1;
    if (messageCount > 30) {
      socket.close(1008, 'Too many updates');
      return;
    }
    session = { ...session, windowStartedAt: sameWindow ? session.windowStartedAt : now, messageCount };
    this.sessions.set(socket, session);
    socket.serializeAttachment(session);

    let message;
    try {
      message = JSON.parse(text);
    } catch {
      safeSend(socket, { type: 'error', message: 'Invalid JSON message.' });
      return;
    }
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      safeSend(socket, { type: 'error', message: 'Invalid message shape.' });
      return;
    }

    if (message.type === 'join') {
      const players = [...this.sessions.values()].map((item) => item.player).filter(Boolean);
      if (session.player || typeof message.id !== 'string' || !/^[\w-]{16,64}$/.test(message.id)) {
        safeSend(socket, { type: 'error', message: 'Invalid or duplicate player identity.' });
        return;
      }
      if (players.length >= MAX_PLAYERS || players.some((player) => player.id === message.id)) {
        safeSend(socket, { type: 'error', message: 'The multiplayer room is full or this identity is already online.' });
        socket.close(1008, 'Room full or duplicate identity');
        return;
      }
      if (typeof message.name !== 'string' || !USERNAME_PATTERN.test(message.name)
        || !validAppearance(message.appearance) || !validBuildingId(message.buildingId)
        || !validVector(message.position) || !validVector(message.target, true)) {
        safeSend(socket, { type: 'error', message: 'Invalid player profile or location.' });
        socket.close(1008, 'Invalid player profile');
        return;
      }

      const player = {
        id: message.id,
        name: message.name.replace(/^@/, ''),
        appearance: message.appearance,
        buildingId: message.buildingId,
        position: message.position,
        target: message.target,
      };
      session = { ...session, player };
      this.sessions.set(socket, session);
      socket.serializeAttachment(session);
      safeSend(socket, { type: 'snapshot', players: players.filter((item) => item.id !== player.id).map(publicPlayer) });
      this.broadcast({ type: 'player', player: publicPlayer(player) }, socket);

      const inboxKey = `inbox:${player.name.toLowerCase()}`;
      const inbox = await this.ctx.storage.get(inboxKey) ?? [];
      for (const item of inbox) safeSend(socket, item);
      await this.ctx.storage.delete(inboxKey);
      return;
    }

    const current = session.player;
    if (!current) {
      safeSend(socket, { type: 'error', message: 'Join the room before sending updates.' });
      return;
    }

    if (message.type === 'move') {
      if (!validVector(message.position) || !validVector(message.target, true)) {
        safeSend(socket, { type: 'error', message: 'Invalid movement update.' });
        return;
      }
      const updated = { ...current, position: message.position, target: message.target };
      session = { ...session, player: updated };
      this.sessions.set(socket, session);
      socket.serializeAttachment(session);
      this.broadcastToBuilding({ type: 'player', player: publicPlayer(updated) }, updated.buildingId, socket);
      return;
    }

    if (message.type === 'update') {
      if (typeof message.name !== 'string' || !USERNAME_PATTERN.test(message.name)
        || !validAppearance(message.appearance) || !validBuildingId(message.buildingId)
        || !validVector(message.position) || !validVector(message.target, true)) {
        safeSend(socket, { type: 'error', message: 'Invalid player update.' });
        return;
      }
      const updated = { ...current, name: message.name.replace(/^@/, ''), appearance: message.appearance,
        buildingId: message.buildingId, position: message.position, target: message.target };
      session = { ...session, player: updated };
      this.sessions.set(socket, session);
      socket.serializeAttachment(session);
      this.broadcast({ type: 'player', player: publicPlayer(updated) }, socket);
      return;
    }

    if (message.type === 'direct-message' || message.type === 'payment') {
      const to = typeof message.to === 'string' ? message.to.replace(/^@/, '').toLowerCase() : '';
      const id = typeof message.id === 'string' && /^[\w-]{8,80}$/.test(message.id) ? message.id : '';
      if (!id || !USERNAME_PATTERN.test(to) || to === current.name.toLowerCase()) {
        safeSend(socket, { type: 'error', message: 'Choose a valid other player.' });
        return;
      }
      let outgoing;
      if (message.type === 'direct-message') {
        const body = typeof message.text === 'string' ? message.text.trim() : '';
        if (!body || body.length > MAX_DIRECT_MESSAGE_LENGTH) {
          safeSend(socket, { type: 'error', message: `Messages must be 1–${MAX_DIRECT_MESSAGE_LENGTH} characters.` });
          return;
        }
        outgoing = { type: 'direct-message', message: { id, from: current.name, to, text: body, sentAt: Date.now() } };
      } else {
        if (!Number.isSafeInteger(message.amount) || message.amount <= 0 || message.amount > 10_000_000) {
          safeSend(socket, { type: 'error', message: 'Enter a valid in-game payment amount.' });
          return;
        }
        outgoing = { type: 'payment', transfer: { id, from: current.name, to, amount: message.amount, sentAt: Date.now() } };
      }

      const recipients = [...this.sessions.entries()].filter(([, item]) => item.player?.name.toLowerCase() === to);
      if (recipients.length) {
        for (const [recipient] of (message.type === 'payment' ? recipients.slice(0, 1) : recipients)) safeSend(recipient, outgoing);
      } else {
        const inboxKey = `inbox:${to}`;
        const inbox = await this.ctx.storage.get(inboxKey) ?? [];
        if (inbox.length >= MAX_PENDING_INBOX) inbox.shift();
        inbox.push(outgoing);
        await this.ctx.storage.put(inboxKey, inbox);
      }
      safeSend(socket, { type: 'delivery-status', id, to, queued: recipients.length === 0 });
      return;
    }

    safeSend(socket, { type: 'error', message: 'Unsupported message type.' });
  }

  webSocketClose(socket, code, reason) {
    const session = this.sessions.get(socket) ?? socket.deserializeAttachment();
    this.sessions.delete(socket);
    if (session?.player) this.broadcast({ type: 'left', id: session.player.id }, socket);
    try { socket.close(code, reason); } catch { /* socket is already closed */ }
  }

  webSocketError(socket) {
    const session = this.sessions.get(socket) ?? socket.deserializeAttachment();
    this.sessions.delete(socket);
    if (session?.player) this.broadcast({ type: 'left', id: session.player.id }, socket);
  }
}
