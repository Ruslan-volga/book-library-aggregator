-- =========================================
-- Настройка базы данных Book Library Aggregator
-- =========================================

-- Создаем базу данных если её нет
CREATE DATABASE library_db;

-- Подключаемся к базе данных (выполнять в контексте library_db)
\c library_db

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  _id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash" VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  "contactPhone" VARCHAR(50),
  role VARCHAR(50) NOT NULL DEFAULT 'client'
);

-- Таблица библиотек
CREATE TABLE IF NOT EXISTS libraries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

-- Таблица книг
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  "libraryId" INTEGER REFERENCES libraries(id),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INTEGER,
  description TEXT,
  "coverImage" VARCHAR(500),
  "isAvailable" BOOLEAN DEFAULT true,
  "totalCopies" INTEGER DEFAULT 1,
  "availableCopies" INTEGER DEFAULT 1
);

-- Таблица обращений в поддержку
CREATE TABLE IF NOT EXISTS support_requests (
  _id SERIAL PRIMARY KEY,
  "userId" integer NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "isActive" boolean NOT NULL DEFAULT true,
  "hasNewMessages" boolean NOT NULL DEFAULT false
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
  _id SERIAL PRIMARY KEY,
  "authorId" integer NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  "text" text NOT NULL,
  "sentAt" TIMESTAMP NOT NULL DEFAULT now(),
  "readAt" TIMESTAMP,
  "supportRequestId" integer NOT NULL REFERENCES support_requests(_id) ON DELETE CASCADE
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS "IDX_users_email" ON users(email);
CREATE INDEX IF NOT EXISTS "IDX_users_role" ON users(role);
CREATE INDEX IF NOT EXISTS "IDX_books_library" ON books("libraryId");
CREATE INDEX IF NOT EXISTS "IDX_books_available" ON books("isAvailable");
CREATE INDEX IF NOT EXISTS "IDX_support_requests_user" ON support_requests("userId");
CREATE INDEX IF NOT EXISTS "IDX_support_requests_is_active" ON support_requests("isActive");
CREATE INDEX IF NOT EXISTS "IDX_messages_support_request" ON messages("supportRequestId");
CREATE INDEX IF NOT EXISTS "IDX_messages_read_at" ON messages("readAt");
CREATE INDEX IF NOT EXISTS "IDX_messages_sent_at" ON messages("sentAt");

-- Тестовые данные
-- Пользователи (пароль для всех: password123)
INSERT INTO users (email, "passwordHash", name, role) VALUES
  ('admin@library.com', '$2b$10$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Администратор', 'admin'),
  ('manager@library.com', '$2b$10$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Менеджер', 'manager'),
  ('client@library.com', '$2b$10$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Клиент', 'client')
ON CONFLICT (email) DO NOTHING;

-- Библиотеки
INSERT INTO libraries (name, address, description) VALUES
  ('Центральная библиотека им. Пушкина', 'Москва, ул. Пушкина, 10', 'Крупнейшая библиотека города с богатой коллекцией классической литературы'),
  ('Научная библиотека МГУ', 'Москва, Ленинские горы, 1', 'Крупнейшая университетская библиотека России'),
  ('Детская библиотека №1', 'Санкт-Петербург, Невский пр., 20', 'Библиотека для детей и подростков')
ON CONFLICT DO NOTHING;

-- Книги
INSERT INTO books ("libraryId", title, author, year, description, "isAvailable", "totalCopies", "availableCopies") VALUES
  (1, 'Война и мир', 'Лев Толстой', 1869, 'Роман-эпопея, описывающий русское общество в эпоху войн против Наполеона', true, 5, 5),
  (1, 'Преступление и наказание', 'Фёдор Достоевский', 1866, 'Роман о нравственных страданиях и психологии преступления', true, 3, 3),
  (1, 'Анна Каренина', 'Лев Толстой', 1877, 'Роман о любви, семье и общественных нормах', true, 4, 4),
  (2, 'Мастер и Маргарита', 'Михаил Булгаков', 1967, 'Мистический роман о добре и зле, любви и творчестве', true, 6, 6),
  (2, 'Тихий Дон', 'Михаил Шолохов', 1940, 'Эпопея о жизни донского казачества во время Первой мировой и Гражданской войн', true, 2, 2),
  (3, 'Гарри Поттер и философский камень', 'Дж. К. Роулинг', 1997, 'Первая книга серии о юном волшебнике Гарри Поттере', true, 10, 10),
  (3, 'Приключения Незнайки', 'Николай Носов', 1954, 'Сказочная повесть о приключениях маленьких человечков', true, 8, 8)
ON CONFLICT DO NOTHING;

-- Проверяем созданные таблицы
SELECT 'Таблицы в базе данных:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

SELECT '';
SELECT 'Данные для входа:' as info;
SELECT '• Администратор: admin@library.com / password123' as credentials
UNION ALL
SELECT '• Менеджер: manager@library.com / password123'
UNION ALL
SELECT '• Клиент: client@library.com / password123';
