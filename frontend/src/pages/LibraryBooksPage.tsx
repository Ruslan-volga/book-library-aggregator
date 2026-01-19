import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Breadcrumbs,
  CircularProgress,
  Alert
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const LibraryBooksPage: React.FC = () => {
  const { libraryId } = useParams<{ libraryId: string }>();
  const [library, setLibrary] = useState<any>(null);
  const [libraryBooks, setLibraryBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { books } = useSelector((state: RootState) => state.books);
  const { libraries } = useSelector((state: RootState) => state.libraries);

  useEffect(() => {
    // Имитация загрузки данных
    setLoading(true);
    
    const timer = setTimeout(() => {
      // Находим библиотеку по ID
      const foundLibrary = libraries.find((lib: any) => lib.id === parseInt(libraryId || '0'));
      
      if (foundLibrary) {
        setLibrary(foundLibrary);
        
        // Фильтруем книги для этой библиотеки
        // В реальном проекте здесь был бы API запрос
        const filteredBooks = books.filter((book: any) => 
          book.libraryId === foundLibrary.id
        );
        
        // Если у книг нет libraryId, распределяем их по библиотекам для демо
        const demoBooks = books.slice(0, 5).map((book: any, index: number) => ({
          ...book,
          libraryId: foundLibrary.id,
          // Добавляем демо-информацию о доступности в этой библиотеке
          copiesAvailable: Math.floor(Math.random() * 3) + 1,
          totalCopies: Math.floor(Math.random() * 5) + 2
        }));
        
        setLibraryBooks(demoBooks);
      }
      
      setLoading(false);
    }, 500); // Имитация задержки сети
    
    return () => clearTimeout(timer);
  }, [libraryId, books, libraries]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!library) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          Библиотека не найдена
        </Alert>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Вернуться на главную
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Хлебные крошки */}
      <Box sx={{ mt: 3, mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ color: 'inherit' }}
          >
            Главная
          </Button>
          <Button
            component={Link}
            to="/"
            startIcon={<LocalLibraryIcon />}
            sx={{ color: 'inherit' }}
          >
            Библиотеки
          </Button>
          <Typography color="text.primary">{library.name}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Заголовок библиотеки */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom color="primary">
          {library.name}
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>��� Контакты</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Адрес:</strong> {library.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Телефон:</strong> {library.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {library.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>��� Доступные книги</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4">{libraryBooks.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    книг в этой библиотеке
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/support"
                  sx={{ mt: 2 }}
                >
                  Задать вопрос о книгах
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Список книг */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Книги в библиотеке
          </Typography>
          <Chip 
            label={`${libraryBooks.length} книг`}
            color="primary"
          />
        </Box>
        
        {libraryBooks.length > 0 ? (
          <Grid container spacing={3}>
            {libraryBooks.map((book: any) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Автор: {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Год издания: {book.year}
                    </Typography>
                    
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Доступно экз.
                            </Typography>
                            <Typography variant="h6" color="primary">
                              {book.copiesAvailable}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Всего экз.
                            </Typography>
                            <Typography variant="h6">
                              {book.totalCopies}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Chip 
                      label={book.available ? 'Доступна для бронирования' : 'Времено недоступна'}
                      color={book.available ? 'success' : 'error'}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!book.available}
                      sx={{ mt: 'auto' }}
                    >
                      Забронировать книгу
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            В этой библиотеке пока нет книг в каталоге.
          </Alert>
        )}
      </Box>

      {/* Кнопка назад */}
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
        >
          Вернуться к списку библиотек
        </Button>
      </Box>
    </Container>
  );
};

export default LibraryBooksPage;
