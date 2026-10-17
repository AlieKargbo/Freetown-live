export interface PlayerRecord {
  id: number;
  username: string;
  display_name: string;
}

export interface LoginRecord {
  id: number;
  username: string;
  password_salt: string;
  password_hash: string;
}

export class DataServiceError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'DataServiceError';
  }
}

async function callDataService<T>(action: string, values: Record<string, unknown> = {}): Promise<T> {
  const baseUrl = process.env.CLOUDFLARE_API_URL;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!baseUrl || !token) throw new Error('Cloudflare data service is not configured.');

  const endpoint = new URL('/_internal/db', baseUrl);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, ...values }),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  });

  const result = await response.json().catch(() => ({})) as { error?: unknown } & T;
  if (!response.ok) {
    const message = typeof result.error === 'string' ? result.error : 'Cloudflare data service request failed.';
    throw new DataServiceError(message, response.status);
  }
  return result;
}

export function createPlayer(input: {
  username: string;
  email: string | null;
  displayName: string;
  passwordSalt: string;
  passwordHash: string;
}) {
  return callDataService<{ id: number }>('create-player', input);
}

export function findPlayerForLogin(username: string, email: string) {
  return callDataService<{ player: LoginRecord | null }>('find-player', { username, email })
    .then(({ player }) => player);
}

export function insertSession(playerId: number, tokenHash: string, expiresAt: number) {
  return callDataService<{ ok: true }>('create-session', { playerId, tokenHash, expiresAt });
}

export function findPlayerBySession(tokenHash: string, now: number) {
  return callDataService<{ player: PlayerRecord | null }>('find-session', { tokenHash, now })
    .then(({ player }) => player);
}

export function deleteSession(tokenHash: string) {
  return callDataService<{ ok: true }>('delete-session', { tokenHash });
}

export function getPlayerSave(playerId: number) {
  return callDataService<{ save: unknown | null }>('get-save', { playerId })
    .then(({ save }) => save);
}

export function putPlayerSave(playerId: number, save: unknown) {
  return callDataService<{ ok: true }>('put-save', { playerId, save });
}
