import api from './client';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post('/auth/login', credentials),
  
  register: (userData: RegisterData): Promise<User> =>
    api.post('/auth/register', userData),
  
  logout: (): Promise<void> =>
    api.post('/auth/logout'),
  
  getProfile: (): Promise<User> =>
    api.get('/users/profile'),
};