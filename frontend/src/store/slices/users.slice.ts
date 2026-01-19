import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'client';
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [
    { id: 1, email: 'admin@test.com', name: 'Администратор', role: 'admin' },
    { id: 2, email: 'manager@test.com', name: 'Менеджер', role: 'manager' },
    { id: 3, email: 'client1@test.com', name: 'Клиент 1', role: 'client' },
    { id: 4, email: 'client2@test.com', name: 'Клиент 2', role: 'client' },
  ],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
});

export default usersSlice.reducer;
