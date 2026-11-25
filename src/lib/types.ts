export interface Row {
  id: string;
  createdAt: string;
  [key: string]: unknown;
}

export type Role = 'owner' | 'staff' | 'demo';

export interface UserRecord {
  id: string;
  username: string;
  displayName: string;
  label?: string;
  role: Role;
  passwordHash: string;
  salt: string;
  active: boolean;
  expiresAt: string | null;
  recoverySalt?: string;
  recoveryHash?: string;
  createdAt: string;
}
