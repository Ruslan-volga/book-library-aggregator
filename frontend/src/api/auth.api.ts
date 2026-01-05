// frontend/src/api/auth.api.ts
import api from './client';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

export const authApi = {
  // Временно используем тестовые данные, пока не реализован backend auth
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Временная заглушка - в реальном проекте здесь будет запрос к бэкенду
    return Promise.resolve({
      access_token: 'test-jwt-token',
      user: {
        id: 1,
        email: credentials.email,
        name: 'Test User',
        role: 'client',
        contactPhone: '+79991234567'
      }
    });
  },
  
  register: (userData: RegisterData): Promise<User> => {
    // Временная заглушка
    return Promise.resolve({
      id: 2,
      email: userData.email,
      name: userData.name,
      role: 'client',
      contactPhone: userData.contactPhone
    });
  },
  
  logout: (): Promise<void> => {
    return Promise.resolve();
  },
  
  getProfile: (): Promise<User> => {
    // Временная заглушка - получение профиля из localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return Promise.resolve(JSON.parse(storedUser));
    }
    
    // Если нет в localStorage, возвращаем тестового пользователя
    return Promise.resolve({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'client',
      contactPhone: '+79991234567'
    });
  },
  
  // Добавим проверку токена
  validateToken: (token: string): Promise<boolean> => {
    return Promise.resolve(!!token);
  }
};