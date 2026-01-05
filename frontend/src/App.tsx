import React, { useState, useEffect } from 'react';
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
  Button
} from '@mui/material';
import { LibraryBooks as LibraryIcon } from '@mui/icons-material';

import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import LibrariesPage from './pages/LibrariesPage';
import BooksPage from './pages/BooksPage';
import BookSearch from './components/BookSearch'; // Импорт компонента

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

const API_BASE_URL = 'http://localhost:3001';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState({
    stats: true,
    libraries: false
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
    fetch(`${API_BASE_URL}/api/libraries/stats/counts`)
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
    fetch(`${API_BASE_URL}/api/libraries`)
      .then(res => res.json())
      .then(data => {
        setLibraries(data);
        setLoading(prev => ({ ...prev, libraries: false }));
      })
      .catch(() => setLoading(prev => ({ ...prev, libraries: false })));
  };

  // Функции для BookSearch компонента
  const handleSearchAPI = async (query: string): Promise<Book[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books`);
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const allBooks = await response.json();
      const searchTerm = query.toLowerCase();
      
      const filtered = allBooks.filter((book: Book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description?.toLowerCase().includes(searchTerm)
      );
      
      return filtered;
    } catch (error) {
      console.error('Search API error:', error);
      return [];
    }
  };

  const loadAllBooksAPI = async (): Promise<Book[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data); // Обновляем состояние в App
      return data;
    } catch (error) {
      console.error('Load books error:', error);
      return [];
    }
  };

  // Тестируем защищенный маршрут
  const testProtectedRoute = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/protected`, {
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

  // Health check
  const testHealth = () => {
    fetch(`${API_BASE_URL}/api/health`)
      .then(res => res.json())
      .then(data => 
        setApiMessage(`Status: ${data.status}, Uptime: ${data.uptime.toFixed(1)}s`)
      )
      .catch(() => setApiMessage('Health check failed'));
  };

  // Компонент главной страницы
  const HomePage = () => {
    return (
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
            onClick={testHealth}
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

        {/* Книги и поиск - ИСПОЛЬЗУЕМ КОМПОНЕНТ */}
        <BookSearch
          onSearch={handleSearchAPI}
          onLoadAll={loadAllBooksAPI}
          initialBooks={books}
        />
      </Box>
    );
  };

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