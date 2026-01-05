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

-- Таблица для refresh токенов (если используется)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавим тестового пользователя
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES (
  'admin@library.com', 
  '$2a$10$YourHashedPasswordHere', -- пароль: admin123
  'Admin', 
  'User', 
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Проверяем
SELECT 'Users:' as table_name, COUNT(*) FROM users;
SELECT 'Refresh tokens:' as table_name, COUNT(*) FROM refresh_tokens;
