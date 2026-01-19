import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import librariesReducer from './slices/librariesSlice';
import supportReducer from './slices/support.slice';
import usersReducer from './slices/users.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    libraries: librariesReducer,
    support: supportReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
