import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container
} from '@mui/material';
import { Menu as MenuIcon, LibraryBooks, Login, Logout } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <LibraryBooks sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            Библиотечная система
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={RouterLink}
              to="/libraries"
              color="inherit"
              sx={{ 
                backgroundColor: location.pathname === '/libraries' ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              Библиотеки
            </Button>
            <Button
              component={RouterLink}
              to="/books"
              color="inherit"
              sx={{ 
                backgroundColor: location.pathname === '/books' ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              Книги
            </Button>

            {isAuthenticated ? (
              <Button
                color="inherit"
                onClick={onLogout}
                startIcon={<Logout />}
              >
                Выйти
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                startIcon={<Login />}
                sx={{ 
                  backgroundColor: location.pathname === '/login' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Войти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
