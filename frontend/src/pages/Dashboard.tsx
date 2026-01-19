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
  Chip,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { books } = useSelector((state: RootState) => state.books);
  const { libraries } = useSelector((state: RootState) => state.libraries);

  return (
    <Container maxWidth="lg">
      {/* Заголовок и приветствие */}
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom color="primary">
          Book Library Aggregator
        </Typography>
        
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Единая система управления библиотеками
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Добро пожаловать, <strong>{user?.name}</strong>!
            </Typography>
            <Chip 
              label={`Роль: ${user?.role === 'admin' ? 'Администратор' : user?.role === 'manager' ? 'Менеджер' : 'Клиент'}`}
              color={user?.role === 'admin' ? 'error' : user?.role === 'manager' ? 'warning' : 'success'}
              sx={{ mb: 2 }}
            />
          </Box>
        ) : (
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
            Для полного доступа к функциям системы войдите в систему
          </Typography>
        )}
      </Box>

      {/* Панель быстрого доступа */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LibraryBooksIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                ��� Книги
              </Typography>
              <Typography variant="h3" color="primary">
                {books.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего в системе
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Доступно: {books.filter(b => b.available).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalLibraryIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                ���️ Библиотеки
              </Typography>
              <Typography variant="h3" color="secondary">
                {libraries.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего библиотек
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {libraries.slice(0, 2).map(l => l.name).join(', ')}...
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SupportAgentIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                ��� Поддержка
              </Typography>
              <Typography variant="h6" gutterBottom>
                Онлайн-чат
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/support"
                fullWidth
                sx={{ mt: 1 }}
              >
                Открыть чат
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Кнопки навигации */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button 
            variant="contained" 
            component={Link} 
            to="/support"
            startIcon={<SupportAgentIcon />}
          >
            Чат поддержки
          </Button>
          
          {isAuthenticated && user?.role === 'admin' && (
            <Button 
              variant="outlined" 
              component={Link} 
              to="/admin"
              startIcon={<AdminPanelSettingsIcon />}
            >
              Админ панель
            </Button>
          )}
          
          {!isAuthenticated && (
            <Button 
              variant="contained" 
              component={Link} 
              to="/login"
              color="primary"
            >
              Войти в систему
            </Button>
          )}
        </Stack>
      </Box>

      {/* Список книг */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Последние книги
        </Typography>
        {books.length > 0 ? (
          <Grid container spacing={2}>
            {books.slice(0, 6).map((book: any) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" noWrap>{book.title}</Typography>
                    <Typography color="textSecondary">Автор: {book.author}</Typography>
                    <Typography color="textSecondary">Год: {book.year}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Chip 
                        label={book.available ? 'Доступна' : 'Занята'} 
                        color={book.available ? 'success' : 'error'} 
                        size="small"
                      />
                      <Button size="small" disabled={!book.available}>
                        Забронировать
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            Книги не найдены. База данных пуста.
          </Typography>
        )}
      </Box>

      {/* Список библиотек */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Наши библиотеки
        </Typography>
        {libraries.length > 0 ? (
          <Grid container spacing={2}>
            {libraries.map((library: any) => (
              <Grid item xs={12} sm={6} md={4} key={library.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{library.name}</Typography>
                    <Typography color="textSecondary" sx={{ mt: 1 }}>
                      ��� {library.address}
                    </Typography>
                    <Typography color="textSecondary">
                      ��� {library.phone}
                    </Typography>
                    <Typography color="textSecondary">
                      ✉️ {library.email}
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ mt: 2 }}
                      fullWidth
                      component={Link}
                      to={`/library/${library.id}`}
                    >
                      Посмотреть книги
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            Библиотеки не найдены. База данных пуста.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
