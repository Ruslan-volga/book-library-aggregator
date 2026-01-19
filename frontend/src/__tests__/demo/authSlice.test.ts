import authReducer, { login, logout } from '../../store/slices/authSlice';

// Мокаем localStorage для тестов
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Auth Slice - Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('initial state is correct', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      isAuthenticated: false,
      user: null,
    });
  });

  test('login action sets user and authentication', () => {
    const user = {
      email: 'test@example.com',
      role: 'admin' as const,
      name: 'Test User',
    };

    const action = login(user);
    const state = authReducer(undefined, action);

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
  });

  test('logout action clears authentication', () => {
    const initialState = {
      isAuthenticated: true,
      user: {
        email: 'test@example.com',
        role: 'admin' as const,
        name: 'Test User',
      },
    };

    const action = logout();
    const state = authReducer(initialState, action);

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  test('restores state from localStorage when available', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('true')
      .mockReturnValueOnce('user@example.com')
      .mockReturnValueOnce('client')
      .mockReturnValueOnce('Test User');

    const state = authReducer(undefined, { type: 'unknown' });

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({
      email: 'user@example.com',
      role: 'client',
      name: 'Test User',
    });
  });
});
