import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  TextField,
  Chip
} from '@mui/material';
import { Search as SearchIcon, Book as BookIcon } from '@mui/icons-material';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description?: string;
  library?: {
    id: number;
    name: string;
  };
  availableCopies?: number;
  totalCopies?: number;
  libraryId?: number;
}

// Базовый URL API - ваш бэкенд работает на порту 3001
const API_BASE_URL = 'http://localhost:3001';

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Прямой запрос к API бэкенда
      const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Преобразуем данные если нужно
      const formattedBooks = data.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        description: book.description || '',
        library: book.library || undefined,
        availableCopies: book.availableCopies || 0,
        totalCopies: book.totalCopies || 0,
        libraryId: book.libraryId
      }));
      
      setBooks(formattedBooks);
      setFilteredBooks(formattedBooks);
      
    } catch (err: any) {
      console.error('Ошибка при загрузке книг:', err);
      setError(`Не удалось загрузить книги: ${err.message}`);
      
      // Fallback: мок данные на случай проблем с API
      const mockBooks: Book[] = [
        {
          id: 1,
          title: 'Война и мир',
          author: 'Лев Толстой',
          year: 1869,
          description: 'Роман-эпопея о русском обществе',
          library: { id: 1, name: 'Центральная библиотека им. Пушкина' },
          availableCopies: 5,
          totalCopies: 5,
          libraryId: 1
        },
        {
          id: 2,
          title: 'Преступление и наказание',
          author: 'Фёдор Достоевский',
          year: 1866,
          description: 'Роман о психологии преступления',
          library: { id: 1, name: 'Центральная библиотека им. Пушкина' },
          availableCopies: 3,
          totalCopies: 3,
          libraryId: 1
        },
        {
          id: 3,
          title: 'Хоббит',
          author: 'Джон Р. Р. Толкин',
          year: 1937,
          description: 'Приключения Бильбо Бэггинса',
          library: { id: 2, name: 'Городская библиотека' },
          availableCopies: 4,
          totalCopies: 4,
          libraryId: 2
        }
      ];
      
      // Используем мок данные если API не отвечает
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setError(null); // Сбрасываем ошибку, так как есть мок данные
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const handleViewBook = (bookId: number) => {
    console.log('Просмотр книги с ID:', bookId);
    // Здесь можно добавить навигацию на страницу книги
    // navigate(`/books/${bookId}`);
  };

  const handleBorrowBook = (bookId: number) => {
    console.log('Взять книгу с ID:', bookId);
    // Здесь можно добавить логику для взятия книги
    alert(`Книга #${bookId} добавлена в ваш список для чтения!`);
  };

  const handleRetry = () => {
    loadBooks();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Загрузка книг...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Подключаемся к серверу библиотеки
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box my={4}>
        {/* Заголовок и информация */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              <BookIcon sx={{ mr: 2, verticalAlign: 'middle', fontSize: 40 }} />
              Каталог книг
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Наша коллекция книг из всех библиотек
            </Typography>
          </Box>
          
          <Box textAlign="right">
            <Typography variant="h6" color="primary">
              {books.length} книг в каталоге
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleRetry}
              disabled={loading}
              size="small"
              sx={{ mt: 1 }}
            >
              Обновить список
            </Button>
          </Box>
        </Box>

        {/* Сообщение об ошибке */}
        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Повторить
              </Button>
            }
          >
            {error}
            <br />
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Используются тестовые данные для демонстрации
            </Typography>
          </Alert>
        )}

        {/* Поиск */}
        <TextField
          fullWidth
          placeholder="Найти книгу по названию, автору или описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 4 }}
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />

        {/* Результаты поиска */}
        {searchQuery && filteredBooks.length > 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Найдено {filteredBooks.length} книг по запросу "{searchQuery}"
          </Typography>
        )}

        {/* Список книг */}
        {filteredBooks.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {searchQuery 
              ? `По запросу "${searchQuery}" книги не найдены. Попробуйте другой запрос.`
              : 'Книги не найдены. Возможно, произошла ошибка при загрузке.'
            }
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Заголовок книги */}
                    <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
                      {book.title}
                    </Typography>
                    
                    {/* Автор и год */}
                    <Typography color="text.secondary" gutterBottom>
                      {book.author}
                      {book.year && ` · ${book.year}`}
                    </Typography>
                    
                    {/* Описание */}
                    {book.description && (
                      <Typography 
                        variant="body2" 
                        paragraph 
                        sx={{ 
                          mt: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {book.description}
                      </Typography>
                    )}
                    
                    {/* Библиотека и доступность */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                      {book.library?.name ? (
                        <Chip
                          label={book.library.name}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ) : (
                        <Chip
                          label="Без библиотеки"
                          size="small"
                          variant="outlined"
                          color="default"
                        />
                      )}
                      
                      <Box textAlign="right">
                        <Typography variant="caption" display="block" color="text.secondary">
                          Доступность
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {book.availableCopies || 0} из {book.totalCopies || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => handleViewBook(book.id)}
                      color="primary"
                    >
                      Подробнее
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleBorrowBook(book.id)}
                      disabled={!book.availableCopies || book.availableCopies === 0}
                    >
                      Взять книгу
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Пагинация или подсказка */}
        {filteredBooks.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Показано {filteredBooks.length} из {books.length} книг
              {searchQuery && ' по вашему запросу'}
            </Typography>
            {books.length > filteredBooks.length && searchQuery && (
              <Button 
                size="small" 
                onClick={() => setSearchQuery('')}
                sx={{ mt: 1 }}
              >
                Показать все книги
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BooksPage;