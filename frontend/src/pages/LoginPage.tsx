import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Вход в систему
          </Typography>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;