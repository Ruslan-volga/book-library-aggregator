import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box,
  Alert
} from '@mui/material';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Для демо-режима используем простую логику
    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    // Определяем роль по email
    const emailLower = email.toLowerCase();
    let role: 'admin' | 'manager' | 'client' = 'client';
    let name = email.split('@')[0];

    if (emailLower.includes('admin') || emailLower.includes('library')) {
      role = 'admin';
      name = 'Администратор';
    } else if (emailLower.includes('manager')) {
      role = 'manager';
      name = 'Менеджер';
    }

    dispatch(login({ 
      email: email.trim(),
      role: role,
      name: name
    }));
    
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Вход в систему
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Book Library Aggregator
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              placeholder="admin@library.com"
            />
            
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              placeholder="Любой пароль"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Демо-доступ:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Email с "admin" или "library" → Администратор
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Email с "manager" → Менеджер
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Любой другой email → Клиент
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Примеры:</strong> admin@library.com, manager@test.com, user@mail.com
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
