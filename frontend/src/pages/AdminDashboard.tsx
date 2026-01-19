import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Панель администратора
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Добро пожаловать, {user?.name}! ({user?.email})
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                ��� Пользователи
              </Typography>
              <Typography variant="body2" paragraph>
                Управление пользователями системы
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/admin/users"
                fullWidth
              >
                Управление пользователями
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                ��� Книги
              </Typography>
              <Typography variant="body2" paragraph>
                Управление книгами и их доступностью
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                disabled
              >
                Скоро доступно
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                ���️ Библиотеки
              </Typography>
              <Typography variant="body2" paragraph>
                Управление библиотеками
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                disabled
              >
                Скоро доступно
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Статистика системы
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">4</Typography>
                  <Typography variant="body2">Пользователя</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">7</Typography>
                  <Typography variant="body2">Книг</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">3</Typography>
                  <Typography variant="body2">Библиотеки</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">2</Typography>
                  <Typography variant="body2">Чат-сессии</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
