import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import booksReducer from '../../store/slices/booksSlice';
import librariesReducer from '../../store/slices/librariesSlice';

describe('Redux Store Configuration', () => {
  test('store can be created with all reducers', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        books: booksReducer,
        libraries: librariesReducer,
      },
    });

    // Проверяем что store создан
    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  test('store has correct initial state structure', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        books: booksReducer,
        libraries: librariesReducer,
      },
    });

    const state = store.getState();
    
    // Проверяем наличие всех редьюсеров
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('books');
    expect(state).toHaveProperty('libraries');
    
    // Проверяем начальное состояние
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBeNull();
    
    expect(state.books.books.length).toBeGreaterThan(0);
    expect(state.books.loading).toBe(false);
    expect(state.books.error).toBeNull();
    
    expect(state.libraries.libraries.length).toBeGreaterThan(0);
    expect(state.libraries.loading).toBe(false);
    expect(state.libraries.error).toBeNull();
  });

  test('store can dispatch actions', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        books: booksReducer,
        libraries: librariesReducer,
      },
    });

    const initialState = store.getState();
    expect(initialState.auth.isAuthenticated).toBe(false);

    // Диспатчим action
    store.dispatch({
      type: 'auth/login',
      payload: {
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User',
      },
    });

    const updatedState = store.getState();
    expect(updatedState.auth.isAuthenticated).toBe(true);
    expect(updatedState.auth.user?.email).toBe('test@example.com');
  });
});
