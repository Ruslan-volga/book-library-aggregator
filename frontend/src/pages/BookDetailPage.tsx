import React from 'react';
import { Typography, Container } from '@mui/material';

const BookDetailPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Детали книги
      </Typography>
      <Typography>
        Страница в разработке...
      </Typography>
    </Container>
  );
};

export default BookDetailPage;
