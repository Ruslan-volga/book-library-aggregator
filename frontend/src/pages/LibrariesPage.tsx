import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Box
} from '@mui/material';
import { LibraryBooks as LibraryIcon, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Library {
  id: number;
  name: string;
  address: string;
  description: string;
  books?: any[];
}

const LibrariesPage: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLibraries();
  }, []);

  useEffect(() => {
    const filtered = libraries.filter(library =>
      library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      library.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      library.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLibraries(filtered);
  }, [searchTerm, libraries]);

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/libraries');
      if (!response.ok) throw new Error('Failed to fetch libraries');
      const data = await response.json();
      setLibraries(data);
      setFilteredLibraries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLibrary = (id: number) => {
    navigate(`/libraries/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          <LibraryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Библиотеки
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск библиотек..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />

      {filteredLibraries.length === 0 ? (
        <Alert severity="info">
          Библиотеки не найдены
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredLibraries.map((library) => (
            <Grid item xs={12} sm={6} md={4} key={library.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {library.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {library.address}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {library.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Книг: {library.books?.length || 0}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleViewLibrary(library.id)}
                  >
                    Подробнее
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default LibrariesPage;
