// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  TextField
} from '@mui/material';
import { LibraryBooks as LibraryIcon, MenuBook as BookIcon } from '@mui/icons-material';

import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import LibrariesPage from './pages/LibrariesPage';
import BooksPage from './pages/BooksPage';

interface Stats {
  totalLibraries: number;
  totalBooks: number;
  totalAvailableBooks: number;
}

interface Library {
  id: number;
  name: string;
  address: string;
  description: string;
  books?: any[];
}

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  library?: {
    name: string;
  };
  description?: string;
  libraryId?: number;
  totalCopies?: number;
  availableCopies?: number;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState({
    stats: true,
    libraries: false,
    books: false
  });
  const [apiMessage, setApiMessage] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Загружаем статистику при монтировании
  useEffect(() => {
    fetch('/api/libraries/stats/counts')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(prev => ({ ...prev, stats: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, stats: false })));
  }, []);

  // Загружаем библиотеки
  const loadLibraries = () => {
    setLoading(prev => ({ ...prev, libraries: true }));
    fetch('/api/libraries')
      .then(res => res.json())
      .then(data => {
        setLibraries(data);
        setLoading(prev => ({ ...prev, libraries: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, libraries: false })));
  };

  // Загружаем книги - ИСПРАВЛЕННЫЙ URL
  const loadBooks = () => {
    setLoading(prev => ({ ...prev, books: true }));
    fetch('/api/books')  // ← ИСПРАВЛЕНО ЗДЕСЬ
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(prev => ({ ...prev, books: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, books: false })));
  };

 // Функция поиска книг
const handleSearch = async () => {
  if (!searchQuery.trim()) {
    // Если поле пустое, загружаем все книги
    loadBooks();
    return;
  }
  
  setLoading(prev => ({ ...prev, books: true }));
  
  try {
    console.log('Ищем книги по запросу:', searchQuery);
    
    // Пробуем несколько вариантов endpointов
    const endpoints = [
      `${API_BASE_URL}/api/libraries/books/search?title=${encodeURIComponent(searchQuery)}`,
      `${API_BASE_URL}/api/books/search?q=${encodeURIComponent(searchQuery)}`,
      `${API_BASE_URL}/api/books`
    ];
    
    let foundBooks: Book[] = [];
    
    for (const endpoint of endpoints) {
      try {
        console.log('Пробуем endpoint:', endpoint);
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Данные получены:', data.length || data);
          
          // Если это endpoint всех книг, фильтруем локально
          if (endpoint.includes('/api/books') && !endpoint.includes('search')) {
            foundBooks = data.filter((book: Book) =>
              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
          } else {
            foundBooks = data;
          }
          
          if (foundBooks.length > 0) {
            console.log(`Найдено книг в ${endpoint}:`, foundBooks.length);
            break;
          }
        }
      } catch (err) {
        console.log(`Endpoint ${endpoint} не сработал:`, err);
      }
    }
    
    if (foundBooks.length === 0) {
      console.log('Книги не найдены, показываем пустой результат');
    }
    
    setBooks(foundBooks);
    
  } catch (error) {
    console.error('Search error:', error);
    setBooks([]); // Показываем пустой список при ошибке
  } finally {
    setLoading(prev => ({ ...prev, books: false }));
  }
};

  // Тестируем защищенный маршрут
  const testProtectedRoute = () => {
    const token = localStorage.getItem('token');
    fetch('/api/protected', {
      headers: token ? { Authorization: token } : {}
    })
      .then(res => {
        if (res.status === 401) {
          return { message: 'Требуется авторизация' };
        }
        return res.json();
      })
      .then(data => setApiMessage(data.message))
      .catch(() => setApiMessage('Ошибка подключения'));
  };

  const HomePage = useCallback(() => (
    <Box my={4}>
      <Typography variant="h4" gutterBottom>
        📚 Библиотечный Агрегатор
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        API для поиска и бронирования книг в библиотеках
      </Typography>

      {/* Проверка состояния API */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          🩺 Проверка состояния API
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetch('/api/health').then(res => res.json()).then(data => 
            setApiMessage(`Status: ${data.status}, Uptime: ${data.uptime.toFixed(1)}s`)
          )}
          sx={{ mr: 2 }}
        >
          Проверить Health
        </Button>
        <Button
          variant="outlined"
          onClick={testProtectedRoute}
        >
          Тест защищенного маршрута
        </Button>
        {apiMessage && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {apiMessage}
          </Alert>
        )}
      </Box>

      {/* Статистика */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          📊 Статистика
        </Typography>
        {loading.stats ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : stats ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Библиотек
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalLibraries}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Всего книг
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalBooks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Доступно книг
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalAvailableBooks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="warning">Не удалось загрузить статистику</Alert>
        )}
      </Box>

      {/* Библиотеки */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            📖 Список библиотек
          </Typography>
          <Button
            variant="outlined"
            onClick={loadLibraries}
            disabled={loading.libraries}
          >
            {loading.libraries ? 'Загрузка...' : 'Обновить'}
          </Button>
        </Box>
        {loading.libraries ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : libraries.length === 0 ? (
          <Alert severity="info">Библиотеки не найдены. Нажмите "Обновить"</Alert>
        ) : (
          <Grid container spacing={3}>
            {libraries.map((lib) => (
              <Grid item xs={12} sm={6} md={4} key={lib.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {lib.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {lib.address}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {lib.description}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Книг: {lib.books?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Книги */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            🔍 Поиск книг
          </Typography>
          <Button
            variant="outlined"
            onClick={loadBooks}
            disabled={loading.books}
          >
            {loading.books ? 'Загрузка...' : 'Все книги'}
          </Button>
        </Box>
        
        {/* Поле для поиска */}
        <TextField
          fullWidth
          placeholder="Введите название книги для поиска..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
          sx={{ mb: 2 }}
        />
        
        {/* Кнопка поиска */}
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading.books}
          sx={{ mb: 3 }}
        >
          {loading.books ? 'Поиск...' : 'Найти книги'}
        </Button>
        
        {loading.books ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : books.length === 0 ? (
          <Alert severity="info">Книги не найдены</Alert>
        ) : (
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {book.author} ({book.year})
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {book.description || 'Описание отсутствует'}
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="primary">
                        {book.library?.name || 'Неизвестная библиотека'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Доступно: {book.availableCopies || 0}/{book.totalCopies || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  ), [
    stats, libraries, books, searchQuery, loading, apiMessage,
    loadLibraries, loadBooks, handleSearch, testProtectedRoute,
    setSearchQuery, setApiMessage
  ]);

  return (
    <Router>
      <Navigation 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
      />
      
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/libraries" element={<LibrariesPage />} />
          <Route path="/books" element={<BooksPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;