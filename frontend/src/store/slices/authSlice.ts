import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id?: number;
  email: string;
  role: 'admin' | 'manager' | 'client';
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const savedAuth = localStorage.getItem('isAuthenticated');
const savedEmail = localStorage.getItem('userEmail');
const savedRole = localStorage.getItem('userRole') as 'admin' | 'manager' | 'client' | null;
const savedName = localStorage.getItem('userName');

const initialState: AuthState = {
  isAuthenticated: savedAuth === 'true',
  user: savedAuth === 'true' && savedEmail && savedRole 
    ? { 
        email: savedEmail, 
        role: savedRole,
        name: savedName || savedEmail.split('@')[0]
      } 
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', action.payload.email);
      localStorage.setItem('userRole', action.payload.role);
      localStorage.setItem('userName', action.payload.name);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
