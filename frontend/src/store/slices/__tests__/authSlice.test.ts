import authReducer, { login, logout } from '../authSlice';
import { configureStore } from '@reduxjs/toolkit';

// Мокируем localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const initialState = authReducer(undefined, { type: '' });
      
      expect(initialState).toEqual({
        isAuthenticated: false,
        user: null,
      });
    });

    it('should restore state from localStorage', () => {
      mockLocalStorage.getItem
        .mockReturnValueOnce('true') // isAuthenticated
        .mockReturnValueOnce('test@example.com') // userEmail
        .mockReturnValueOnce('admin') // userRole
        .mockReturnValueOnce('Test User'); // userName

      const initialState = authReducer(undefined, { type: '' });

      expect(initialState.isAuthenticated).toBe(true);
      expect(initialState.user).toEqual({
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User',
      });
    });
  });

  describe('login action', () => {
    it('should handle login correctly', () => {
      const user = {
        email: 'test@example.com',
        role: 'admin' as const,
        name: 'Test User',
      };

      const action = login(user);
      const state = authReducer(undefined, action);

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userEmail', user.email);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userRole', user.role);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userName', user.name);
    });
  });

  describe('logout action', () => {
    it('should handle logout correctly', () => {
      const loggedInState = {
        isAuthenticated: true,
        user: {
          email: 'test@example.com',
          role: 'admin' as const,
          name: 'Test User',
        },
      };

      const action = logout();
      const state = authReducer(loggedInState, action);

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userEmail');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userRole');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userName');
    });
  });

  describe('integration with Redux store', () => {
    it('should work correctly in Redux store', () => {
      const store = configureStore({
        reducer: {
          auth: authReducer,
        },
      });

      // Проверяем начальное состояние
      expect(store.getState().auth.isAuthenticated).toBe(false);

      // Диспатчим логин
      store.dispatch(login({
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User',
      }));

      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.user?.email).toBe('test@example.com');

      // Диспатчим логаут
      store.dispatch(logout());
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });
  });
});
