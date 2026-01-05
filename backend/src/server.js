const express = require('express');
const cors = require('cors');
const authRouter = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Статические данные
const libraries = [
  {
    id: 1,
    name: 'Центральная библиотека им. Пушкина',
    address: 'ул. Пушкина, 1',
    description: 'Главная библиотека города',
    books: [
      { id: 1, title: 'Война и мир', author: 'Лев Толстой', year: 1869 },
      { id: 2, title: 'Преступление и наказание', author: 'Фёдор Достоевский', year: 1866 }
    ]
  },
  {
    id: 2,
    name: 'Городская библиотека',
    address: 'ул. Ленина, 10',
    description: 'Культурно-образовательный центр',
    books: [
      { id: 3, title: 'Хоббит', author: 'Джон Р. Р. Толкин', year: 1937 },
      { id: 4, title: 'Властелин колец', author: 'Джон Р. Р. Толкин', year: 1954 }
    ]
  }
];

const books = [
  {
    id: 1,
    libraryId: 1,
    title: 'Война и мир',
    author: 'Лев Толстой',
    year: 1869,
    description: 'Роман-эпопея о русском обществе',
    totalCopies: 5,
    availableCopies: 5,
    library: { id: 1, name: 'Центральная библиотека им. Пушкина' }
  },
  {
    id: 2,
    libraryId: 1,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    year: 1866,
    description: 'Роман о психологии преступления',
    totalCopies: 3,
    availableCopies: 3,
    library: { id: 1, name: 'Центральная библиотека им. Пушкина' }
  },
  {
    id: 3,
    libraryId: 2,
    title: 'Хоббит',
    author: 'Джон Р. Р. Толкин',
    year: 1937,
    description: 'Приключения Бильбо Бэггинса',
    totalCopies: 4,
    availableCopies: 4,
    library: { id: 2, name: 'Городская библиотека' }
  }
];

// Маршруты аутентификации
app.use('/api/auth', authRouter);

// Публичные маршруты
app.get('/api', (req, res) => {
  res.json({
    message: 'Book Library Aggregator API',
    version: '1.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me'
      },
      libraries: 'GET /api/libraries',
      books: 'GET /api/books',
      stats: 'GET /api/libraries/stats/counts',
      search: 'GET /api/libraries/books/search?title=...',
      protected: 'GET /api/protected',
      health: 'GET /api/health'
    }
  });
});

app.get('/api/libraries', (req, res) => {
  res.json(libraries);
});

app.get('/api/books', (req, res) => {
  res.json(books);
});

// Статистика
app.get('/api/libraries/stats/counts', (req, res) => {
  const totalAvailableBooks = books.reduce((sum, book) => {
    return sum + (book.availableCopies || 0);
  }, 0);
  
  res.json({
    totalLibraries: libraries.length,
    totalBooks: books.length,
    totalAvailableBooks: totalAvailableBooks
  });
});

// Поиск книг
app.get('/api/libraries/books/search', (req, res) => {
  const { title, author } = req.query;
  let filteredBooks = books;
  
  if (title) {
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  
  if (author) {
    filteredBooks = filteredBooks.filter(book => 
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  
  res.json(filteredBooks);
});

// Защищенный маршрут
app.get('/api/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer fake-jwt-token-')) {
    return res.status(401).json({
      success: false,
      message: 'Требуется авторизация'
    });
  }
  
  res.json({
    success: true,
    message: 'Доступ к защищенному маршруту разрешен',
    data: 'Секретные данные'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Book Library Aggregator API'
  });
});

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <h1>Book Library Aggregator API</h1>
    <p>Сервер работает! Используйте следующие маршруты:</p>
    <ul>
      <li><a href="/api">/api</a> - информация о API</li>
      <li><a href="/api/libraries">/api/libraries</a> - список библиотек</li>
      <li><a href="/api/books">/api/books</a> - список книг</li>
      <li><a href="/api/health">/api/health</a> - проверка здоровья</li>
    </ul>
  `);
});

// Добавьте этот код в server.js после других маршрутов

// Поиск книг
app.get('/api/libraries/books/search', (req, res) => {
  const { title, author } = req.query;
  console.log(`[SEARCH] Поиск: title=${title}, author=${author}`);
  
  // Ваши книги из данных
  const books = [
    {
      id: 1,
      libraryId: 1,
      title: 'Война и мир',
      author: 'Лев Толстой',
      year: 1869,
      description: 'Роман-эпопея о русском обществе',
      totalCopies: 5,
      availableCopies: 5,
      library: { id: 1, name: 'Центральная библиотека им. Пушкина' }
    },
    {
      id: 2,
      libraryId: 1,
      title: 'Преступление и наказание',
      author: 'Фёдор Достоевский',
      year: 1866,
      description: 'Роман о психологии преступления',
      totalCopies: 3,
      availableCopies: 3,
      library: { id: 1, name: 'Центральная библиотека им. Пушкина' }
    },
    {
      id: 3,
      libraryId: 2,
      title: 'Хоббит',
      author: 'Джон Р. Р. Толкин',
      year: 1937,
      description: 'Приключения Бильбо Бэггинса',
      totalCopies: 4,
      availableCopies: 4,
      library: { id: 2, name: 'Городская библиотека' }
    }
  ];
  
  let filteredBooks = books;
  
  if (title) {
    const searchTerm = title.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm)
    );
  }
  
  if (author) {
    const searchTerm = author.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.author.toLowerCase().includes(searchTerm)
    );
  }
  
  console.log(`[SEARCH] Найдено книг: ${filteredBooks.length}`);
  res.json(filteredBooks);
});

// Или добавьте более простой поиск к существующему endpoint
app.get('/api/books/search', (req, res) => {
  const { q } = req.query;
  
  const books = [
    // те же книги
  ];
  
  if (!q) {
    return res.json(books);
  }
  
  const searchTerm = q.toLowerCase();
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm)
  );
  
  res.json(filteredBooks);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступен по адресу: http://localhost:${PORT}/api`);
  console.log('Тестовые пользователи:');
  console.log('1. admin@library.com / admin123');
  console.log('2. user@library.com / user123');
});
