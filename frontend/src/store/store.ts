import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import authReducer from './slices/authSlice';
import librariesReducer from './slices/librariesSlice';
import supportReducer from './slices/support.slice';
import usersReducer from './slices/users.slice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    libraries: librariesReducer,
    support: supportReducer,
    users: usersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
