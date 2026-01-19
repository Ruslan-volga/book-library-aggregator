import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './pages/Dashboard';
import SupportPage from './pages/SupportPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import LibraryBooksPage from './pages/LibraryBooksPage';
import UsersManagement from './components/Admin/UsersManagement';
import { AppBar, Toolbar, Button, Container, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Компонент для защищенных маршрутов
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'client';
}> = ({ children, requiredRole = 'client' }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Доступ запрещен
        </Typography>
        <Typography variant="body1" paragraph>
          Для доступа к этой странице необходимо войти в систему.
        </Typography>
        <Button variant="contained" component={Link} to="/login">
          Войти
        </Button>
      </Container>
    );
  }
  
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Недостаточно прав
        </Typography>
        <Typography variant="body1" paragraph>
          Для доступа к этой странице требуются права администратора.
        </Typography>
        <Button variant="contained" component={Link} to="/">
          На главную
        </Button>
      </Container>
    );
  }
  
  return <>{children}</>;
};

// Компонент навигации
const Navigation: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Book Library Aggregator
        </Typography>
        
        <Button color="inherit" component={Link} to="/">
          Главная
        </Button>
        
        <Button color="inherit" component={Link} to="/support">
          Чат поддержки
        </Button>
        
        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin">
                Админ панель
              </Button>
            )}
            <Button 
              color="inherit" 
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                window.location.href = '/';
              }}
            >
              Выйти ({user?.name})
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Войти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

// Главный компонент приложения
const AppContent: React.FC = () => {
  return (
    <>
      <Navigation />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/library/:libraryId" element={<LibraryBooksPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersManagement />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Резервный маршрут для 404 */}
          <Route 
            path="*" 
            element={
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                  404 - Страница не найдена
                </Typography>
                <Button variant="contained" component={Link} to="/">
                  На главную
                </Button>
              </Box>
            } 
          />
        </Routes>
      </Container>
      
      {/* Футер */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'background.paper', 
          py: 3, 
          mt: 'auto',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Book Library Aggregator. Дипломный проект.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Для демо используйте: admin@library.com / manager@test.com / user@mail.com
          </Typography>
        </Container>
      </Box>
    </>
  );
};

// Главный компонент с провайдерами
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
