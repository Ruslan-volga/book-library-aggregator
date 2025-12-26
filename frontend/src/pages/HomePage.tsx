import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { getProfile } from '../store/slices/authSlice';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [token, user, dispatch]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          📚 Библиотечный агрегатор
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Поиск и бронирование книг в библиотеках вашего города
        </Typography>
        
        {user ? (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
              Добро пожаловать, {user.name}!
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Теперь вы можете пользоваться всеми возможностями нашего сервиса.
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom>
                      Поиск книг
                    </Typography>
                    <Typography>
                      Ищите книги по названию, автору или жанру в библиотеках города
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      component={RouterLink} 
                      to="/books"
                      variant="contained"
                    >
                      Найти книги
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <CalendarTodayIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom>
                      Бронирование
                    </Typography>
                    <Typography>
                      Бронируйте понравившиеся книги на удобные даты
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      component={RouterLink} 
                      to="/my-rentals"
                      variant="contained"
                      color="secondary"
                    >
                      Мои бронирования
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <LibraryBooksIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom>
                      Библиотеки
                    </Typography>
                    <Typography>
                      Просматривайте библиотеки города и их коллекции книг
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      component={RouterLink} 
                      to="/libraries"
                      variant="contained"
                      color="success"
                    >
                      Список библиотек
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: 6, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Начните пользоваться сервисом уже сегодня!
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Зарегистрируйтесь, чтобы получить доступ к поиску книг, бронированию 
              и другим возможностям нашего агрегатора библиотек.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/register"
                size="large"
              >
                Зарегистрироваться
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/login"
                size="large"
              >
                Войти
              </Button>
            </Box>
            
            <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                🚀 Быстрый старт
              </Typography>
              <Typography variant="body2" color="textSecondary">
                1. Зарегистрируйтесь или войдите в систему<br />
                2. Найдите интересующие вас книги<br />
                3. Забронируйте книги на удобные даты<br />
                4. Забирайте книги в выбранной библиотеке
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;