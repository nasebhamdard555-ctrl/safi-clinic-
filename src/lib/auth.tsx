import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { store } from './store';
import { hashPassword, randomSalt } from './crypto';
import { seedSampleData } from './seed';
import type { UserRecord } from './types';

interface AuthContextValue {
  user: UserRecord | null;
  ownerExists: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  setupOwner: (name: string, username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = 'systech:session';

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
        const sid = sessionStorage.getItem(SESSION_KEY);
        const found = sid ? users.find((u) => u.id === sid) : undefined;
        if (found && !accessProblem(found)) setUser(found);
        else sessionStorage.removeItem(SESSION_KEY);
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
    const hash = await hashPassword(password, u.salt);
    if (hash !== u.passwordHash) throw new Error('Wrong username or password.');
    const problem = accessProblem(u);
    if (problem) throw new Error(problem);
    sessionStorage.setItem(SESSION_KEY, u.id);
    setUser(u);
  };

  const setupOwner = async (name: string, username: string, password: string) => {
    const users = await loadUsers();
    if (users.some((u) => u.role === 'owner')) throw new Error('An owner account already exists.');
    if (!name.trim() || !username.trim()) throw new Error('Enter your name and a username.');
    if (password.length < 8) throw new Error('Use at least 8 characters for the password.');
    const salt = randomSalt();
    const passwordHash = await hashPassword(password, salt);
    const row = await store.insert('users', {
      username: username.trim(),
      displayName: name.trim(),
      role: 'owner',
      passwordHash,
      salt,
      active: true,
      expiresAt: null,
    });
    sessionStorage.setItem(SESSION_KEY, row.id);
    setOwnerExists(true);
    setUser(row as unknown as UserRecord);
  };

  const signOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ownerExists, loading, signIn, setupOwner, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
