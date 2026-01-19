export interface User {
  _id: number;
  email: string;
  name: string;
  contactPhone?: string;
  role: 'client' | 'admin' | 'manager';
  passwordHash?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
