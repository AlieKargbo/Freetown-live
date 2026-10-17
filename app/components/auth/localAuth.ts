const ACCOUNTS_KEY = 'freetown-life-local-accounts-v1';
const PASSWORD_ITERATIONS = 120_000;

type LocalAccount = {
  username: string;
  displayName: string;
  email: string;
  salt: string;
  passwordHash: string;
};

type AuthResult = { ok: true; username: string } | { ok: false; error: string };

function readAccounts(): LocalAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((account): account is LocalAccount => Boolean(
    account
    && typeof account.username === 'string'
    && typeof account.displayName === 'string'
    && typeof account.email === 'string'
    && typeof account.salt === 'string'
    && typeof account.passwordHash === 'string',
  ));
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

function fromHex(value: string): Uint8Array {
  if (!/^(?:[\da-f]{2})+$/i.test(value)) return new Uint8Array();
  return Uint8Array.from(value.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));
}

function isAdult(dateOfBirth: string): boolean {
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (!dateOfBirth || Number.isNaN(birth.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday = today.getMonth() < birth.getMonth()
    || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 18 && birth <= today;
}

export async function createLocalAccount(input: {
  username: string;
  displayName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}): Promise<AuthResult> {
  const username = input.username.trim().replace(/^@/, '').toLowerCase();
  const displayName = input.displayName.trim();
  const email = input.email.trim().toLowerCase();

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return { ok: false, error: 'Use 3–20 letters, numbers, or underscores for your username.' };
  }
  if (!displayName || displayName.length > 80) {
    return { ok: false, error: 'Enter a name up to 80 characters long.' };
  }
  if (input.password.length < 8) {
    return { ok: false, error: 'Use a password with at least 8 characters.' };
  }
  if (!isAdult(input.dateOfBirth)) {
    return { ok: false, error: 'You must be at least 18 years old to create an account.' };
  }

  try {
    const accounts = readAccounts();
    if (accounts.some((account) => account.username === username)) {
      return { ok: false, error: 'That username is already registered in this browser.' };
    }
    if (email && accounts.some((account) => account.email === email)) {
      return { ok: false, error: 'That email is already registered in this browser.' };
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    accounts.push({
      username,
      displayName,
      email,
      salt: toHex(salt),
      passwordHash: await hashPassword(input.password, salt),
    });
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return { ok: true, username: `@${username}` };
  } catch {
    return { ok: false, error: 'Could not save the account in this browser. Check storage and try again.' };
  }
}

export async function signInLocalAccount(identifier: string, password: string): Promise<AuthResult> {
  const login = identifier.trim().replace(/^@/, '').toLowerCase();
  if (!login || !password) return { ok: false, error: 'Enter your username or email and password.' };

  try {
    const account = readAccounts().find((candidate) => candidate.username === login || (candidate.email && candidate.email === identifier.trim().toLowerCase()));
    if (!account) return { ok: false, error: 'No account with those details is saved in this browser.' };
    const salt = fromHex(account.salt);
    if (salt.length !== 16 || await hashPassword(password, salt) !== account.passwordHash) {
      return { ok: false, error: 'The username/email or password is incorrect.' };
    }
    return { ok: true, username: `@${account.username}` };
  } catch {
    return { ok: false, error: 'Could not read saved accounts from this browser.' };
  }
}
