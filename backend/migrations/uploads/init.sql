-- backend/init.sql
-- Создание пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'client',
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка тестовых пользователей
INSERT INTO users (email, password, name, role, contact_phone) VALUES
('admin@library.com', '$2b$10$YourHashedPasswordHere', 'Администратор', 'admin', '+79990000001'),
('manager@library.com', '$2b$10$YourHashedPasswordHere', 'Менеджер', 'manager', '+79990000002'),
('user@library.com', '$2b$10$YourHashedPasswordHere', 'Тестовый пользователь', 'client', '+79990000003')
ON CONFLICT (email) DO NOTHING;

-- Создание таблицы библиотек
CREATE TABLE IF NOT EXISTS libraries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка тестовых библиотек
INSERT INTO libraries (name, address, description) VALUES
('Центральная библиотека', 'ул. Ленина, 1', 'Крупнейшая библиотека города с фондом более 1 млн книг'),
('Библиотека им. Пушкина', 'ул. Пушкина, 10', 'Современная библиотека с электронным каталогом'),
('Детская библиотека', 'пр. Мира, 5', 'Библиотека для детей и подростков')
ON CONFLICT DO NOTHING;