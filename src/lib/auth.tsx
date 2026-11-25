import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { store } from './store';
import { hashPassword, randomSalt, randomToken } from './crypto';
import { seedSampleData } from './seed';
import type { UserRecord } from './types';

interface SetupResult {
  row: UserRecord;
  recoveryCode: string;
}

interface AuthContextValue {
  user: UserRecord | null;
  ownerExists: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  setupOwner: (name: string, username: string, password: string) => Promise<SetupResult>;
  enterAfterSetup: (row: UserRecord) => void;
  resetWithRecoveryCode: (username: string, code: string, newPassword: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = 'systech2:session';
let memorySession: string | null = null;

// Browsers can block sessionStorage inside embedded frames; keep a memory copy too.
function saveSession(id: string) {
  memorySession = id;
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    /* blocked: memory copy is used */
  }
}
function loadSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY) ?? memorySession;
  } catch {
    return memorySession;
  }
}
function clearSession() {
  memorySession = null;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* blocked */
  }
}

// Recovery codes look like ABCD-EFGH-JKLM-NPQR. They are compared without dashes or case.
export function makeRecoveryCode(): string {
  const raw = randomToken(16).toUpperCase();
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
}
const normalizeCode = (code: string) => code.replace(/[\s-]/g, '').toLowerCase();

async function loadUsers(): Promise<UserRecord[]> {
  return (await store.list('users')) as unknown as UserRecord[];
}

function accessProblem(u: UserRecord): string | null {
  if (!u.active) return 'This account has been disabled. Contact your Systech representative.';
  if (u.expiresAt && new Date(u.expiresAt).getTime() < Date.now()) {
    return 'This demo access has expired. Contact your Systech representative.';
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [ownerExists, setOwnerExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await seedSampleData();
        const users = await loadUsers();
        setOwnerExists(users.some((u) => u.role === 'owner'));
        const sid = loadSession();
        const found = sid ? users.find((u) => u.id === sid) : undefined;
        if (found && !accessProblem(found)) setUser(found);
        else clearSession();
      } catch {
        // If storage is unavailable the login page still shows, with its own error on sign-in.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (username: string, password: string) => {
    const users = await loadUsers();
    const u = users.find((x) => x.username.toLowerCase() === username.trim().toLowerCase());
    if (!u) throw new Error('Wrong username or password.');
    if ((await hashPassword(password, u.salt)) !== u.passwordHash) throw new Error('Wrong username or password.');
    const problem = accessProblem(u);
    if (problem) throw new Error(problem);
    saveSession(u.id);
    setUser(u);
  };

  const setupOwner = async (name: string, username: string, password: string): Promise<SetupResult> => {
    const users = await loadUsers();
    if (users.some((u) => u.role === 'owner')) throw new Error('An owner account already exists.');
    if (!name.trim() || !username.trim()) throw new Error('Enter your name and a username.');
    if (password.length < 8) throw new Error('Use at least 8 characters for the password.');
    const salt = randomSalt();
    const recoverySalt = randomSalt();
    const recoveryCode = makeRecoveryCode();
    const row = await store.insert('users', {
      username: username.trim(),
      displayName: name.trim(),
      role: 'owner',
      passwordHash: await hashPassword(password, salt),
      salt,
      recoverySalt,
      recoveryHash: await hashPassword(normalizeCode(recoveryCode), recoverySalt),
      active: true,
      expiresAt: null,
    });
    setOwnerExists(true);
    return { row: row as unknown as UserRecord, recoveryCode };
  };

  const enterAfterSetup = (row: UserRecord) => {
    saveSession(row.id);
    setUser(row);
  };

  const resetWithRecoveryCode = async (username: string, code: string, newPassword: string) => {
    if (newPassword.length < 8) throw new Error('Use at least 8 characters for the new password.');
    const users = await loadUsers();
    const u = users.find((x) => x.role === 'owner' && x.username.toLowerCase() === username.trim().toLowerCase());
    if (!u || !u.recoveryHash || !u.recoverySalt) {
      throw new Error('That owner account has no recovery code. Staff and demo logins are reset by the admin.');
    }
    if ((await hashPassword(normalizeCode(code), u.recoverySalt)) !== u.recoveryHash) {
      throw new Error('The recovery code is wrong.');
    }
    const salt = randomSalt();
    await store.update('users', u.id, { salt, passwordHash: await hashPassword(newPassword, salt) });
  };

  const refreshUser = async () => {
    const users = await loadUsers();
    setUser((prev) => (prev ? users.find((u) => u.id === prev.id) ?? prev : prev));
  };

  const signOut = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, ownerExists, loading, signIn, setupOwner, enterAfterSetup, resetWithRecoveryCode, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
