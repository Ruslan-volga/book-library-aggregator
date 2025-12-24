export interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'admin' | 'manager';
  contactPhone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  contactPhone?: string;
}