import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Добро пожаловать в библиотечный агрегатор!
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Поиск и бронирование книг в библиотеках города
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;