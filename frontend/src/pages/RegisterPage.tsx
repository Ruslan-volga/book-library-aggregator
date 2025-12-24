import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Регистрация
          </Typography>
          <RegisterForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;