// components/BookSearch.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  library?: {
    name: string;
  };
  description?: string;
  availableCopies?: number;
  totalCopies?: number;
}

interface BookSearchProps {
  onSearch: (query: string) => Promise<Book[]>;
  onLoadAll: () => Promise<Book[]>;
  initialBooks?: Book[];
}

const BookSearch: React.FC<BookSearchProps> = ({ 
  onSearch, 
  onLoadAll,
  initialBooks = []
}) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Фокусируемся на поле ввода при монтировании
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await onSearch(searchQuery);
      setBooks(results);
      setShowAll(false);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAll = async () => {
    setLoading(true);
    try {
      const results = await onLoadAll();
      setBooks(results);
      setShowAll(true);
      setSearchQuery('');
    } catch (error) {
      console.error('Load all failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          🔍 Поиск книг
        </Typography>
        <Button
          variant="outlined"
          onClick={handleLoadAll}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Все книги'}
        </Button>
      </Box>
      
      {/* Поисковая строка */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Введите название книги для поиска..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none'
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          startIcon={<SearchIcon />}
        >
          Найти
        </Button>
      </Box>

      {/* Результаты */}
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : books.length === 0 ? (
        <Alert severity="info">
          {searchQuery 
            ? `По запросу "${searchQuery}" книги не найдены` 
            : 'Книги не найдены. Нажмите "Все книги"'}
        </Alert>
      ) : (
        <>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {showAll 
              ? `Все книги: ${books.length}` 
              : `Найдено книг: ${books.length} по запросу "${searchQuery}"`}
          </Typography>
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
        </>
      )}
    </Box>
  );
};

export default BookSearch;