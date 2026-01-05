// frontend/src/Auth.jsx
import React, { useState, useEffect } from 'react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Проверяем, есть ли сохраненный пользователь при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Очищаем форму
        setFormData({ email: '', password: '', name: '' });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessage('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
    }
  };

  // Если пользователь авторизован
  if (user) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.userInfo}>
          <h3>👤 Профиль пользователя</h3>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
          
          <div style={styles.buttonGroup}>
            <button onClick={getUserInfo} style={styles.secondaryButton}>
              Обновить информацию
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Выйти
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Форма входа/регистрации
  return (
    <div style={styles.authContainer}>
      <div style={styles.toggleButtons}>
        <button
          onClick={() => setIsLogin(true)}
          style={{
            ...styles.toggleButton,
            ...(isLogin ? styles.activeToggle : {})
          }}
        >
          Вход
        </button>
        <button
          onClick={() => setIsLogin(false)}
          style={{
            ...styles.toggleButton,
            ...(!isLogin ? styles.activeToggle : {})
          }}
        >
          Регистрация
        </button>
      </div>

      <h3>{isLogin ? 'Вход в систему' : 'Регистрация'}</h3>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <div style={styles.inputGroup}>
            <label>Имя:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите ваше имя"
              required={!isLogin}
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            required
            style={styles.input}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
        </button>
      </form>

      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}

      <div style={styles.testUsers}>
        <h4>Тестовые пользователи:</h4>
        <ul style={styles.userList}>
          <li><strong>Администратор:</strong> admin@library.com / admin123</li>
          <li><strong>Пользователь:</strong> user@library.com / user123</li>
          <li><strong>Демо:</strong> demo@demo.com / demo123</li>
        </ul>
      </div>
    </div>
  );
}

// Стили
const styles = {
  authContainer: {
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  toggleButtons: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  toggleButton: {
    flex: 1,
    padding: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px'
  },
  activeToggle: {
    borderBottom: '2px solid #1976d2',
    fontWeight: 'bold',
    color: '#1976d2'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  message: {
    padding: '10px',
    marginTop: '15px',
    borderRadius: '4px',
    textAlign: 'center'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  userInfo: {
    textAlign: 'center'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '20px'
  },
  secondaryButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  testUsers: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '14px'
  },
  userList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0 0'
  }
};

export default Auth;