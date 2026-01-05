-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'USER',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем тестовых пользователей
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@library.com', '$2a$10$Vw.6Z/5z2p7W8q9J0kLmN.uT1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L', 'Admin', 'User', 'ADMIN'),
('user@library.com', '$2a$10$Vw.6Z/5z2p7W8q9J0kLmN.uT1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L', 'Regular', 'User', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Проверяем
SELECT 'Users table created successfully' as message;
SELECT * FROM users;
