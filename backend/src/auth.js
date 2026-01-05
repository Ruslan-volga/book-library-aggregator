const express = require('express');
const router = express.Router();

// Тестовые пользователи
const users = [
  {
    id: 1,
    email: 'admin@library.com',
    password: 'admin123',
    name: 'Администратор',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@library.com',
    password: 'user123',
    name: 'Пользователь',
    role: 'user'
  },
  {
    id: 3,
    email: 'demo@demo.com',
    password: 'demo123',
    name: 'Демо пользователь',
    role: 'user'
  }
];

// Простая аутентификация
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      token: `fake-jwt-token-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Неверный email или пароль'
    });
  }
});

// Регистрация
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Проверка существующего пользователя
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Пользователь с таким email уже существует'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    role: 'user'
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    message: 'Регистрация успешна',
    token: `fake-jwt-token-${newUser.id}`,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// Проверка токена
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer fake-jwt-token-')) {
    return res.status(401).json({
      success: false,
      message: 'Требуется авторизация'
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const userId = parseInt(token.split('-')[3]);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

module.exports = router;
