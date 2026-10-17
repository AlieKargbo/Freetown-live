import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { WebSocket } from 'ws';
import { createRealtimeServer } from './server.mjs';

const appearance = {
  name: '@tester',
  body: 'Woman',
  hairstyle: 'Braids',
  outfit: 'Owambe',
  fabric: 'Ankara',
  skin: '#8d5524',
  hairColor: '#171311',
  accent: '#f59e0b',
};

async function openSocket(url) {
  const socket = new WebSocket(url);
  await once(socket, 'open');
  return socket;
}

function waitForMessage(socket, predicate) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off('message', onMessage);
      reject(new Error('Timed out waiting for realtime message.'));
    }, 2000);
    const onMessage = (data) => {
      const message = JSON.parse(data.toString());
      if (!predicate(message)) return;
      clearTimeout(timer);
      socket.off('message', onMessage);
      resolve(message);
    };
    socket.on('message', onMessage);
  });
}

test('broadcasts real player presence, building, and movement to connected clients', async (t) => {
  const server = createRealtimeServer({ host: '127.0.0.1', port: 0, allowedOrigins: [] });
  await server.listen();
  t.after(() => server.close());

  const address = server.httpServer.address();
  assert.ok(address && typeof address !== 'string');
  const health = await fetch(`http://127.0.0.1:${address.port}/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'ok');
  const url = `ws://127.0.0.1:${address.port}`;
  const first = await openSocket(url);
  const firstSnapshot = waitForMessage(first, (message) => message.type === 'snapshot');
  first.send(JSON.stringify({
    type: 'join',
    id: 'player-tab-000000000001',
    name: 'tester',
    appearance,
    buildingId: 'bank',
    position: [-2, -1],
    target: null,
  }));
  assert.deepEqual((await firstSnapshot).players, []);

  const firstSeesSecond = waitForMessage(
    first,
    (message) => message.type === 'player' && message.player.id === 'player-tab-000000000002',
  );
  const second = await openSocket(url);
  const secondSnapshot = waitForMessage(second, (message) => message.type === 'snapshot');
  second.send(JSON.stringify({
    type: 'join',
    id: 'player-tab-000000000002',
    name: 'visitor',
    appearance: { ...appearance, name: '@visitor' },
    buildingId: 'bank',
    position: [0, 0],
    target: null,
  }));
  assert.equal((await secondSnapshot).players[0].name, 'tester');
  await firstSeesSecond;

  const buildingChange = waitForMessage(
    first,
    (message) => message.type === 'player'
      && message.player.id === 'player-tab-000000000002'
      && message.player.buildingId === 'pharmacy',
  );
  second.send(JSON.stringify({
    type: 'update',
    name: 'visitor',
    appearance: { ...appearance, name: '@visitor' },
    buildingId: 'pharmacy',
    position: [0, 0],
    target: null,
  }));
  await buildingChange;

  const secondSeesFirstAtPharmacy = waitForMessage(
    second,
    (message) => message.type === 'player'
      && message.player.id === 'player-tab-000000000001'
      && message.player.buildingId === 'pharmacy',
  );
  first.send(JSON.stringify({
    type: 'update',
    name: 'tester',
    appearance,
    buildingId: 'pharmacy',
    position: [-2, -1],
    target: null,
  }));
  await secondSeesFirstAtPharmacy;

  const movementUpdate = waitForMessage(
    first,
    (message) => message.type === 'player'
      && message.player.id === 'player-tab-000000000002'
      && message.player.target?.[0] === 2,
  );
  second.send(JSON.stringify({ type: 'move', position: [0.5, 0], target: [2, 1] }));
  const movedPlayer = await movementUpdate;
  assert.deepEqual(movedPlayer.player.position, [0.5, 0]);
  assert.deepEqual(movedPlayer.player.target, [2, 1]);

  const playerLeft = waitForMessage(first, (message) => message.type === 'left');
  second.close();
  assert.equal((await playerLeft).id, 'player-tab-000000000002');
  first.close();
});
