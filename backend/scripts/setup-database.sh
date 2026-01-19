#!/bin/bash

echo "========================================="
echo " Настройка базы данных PostgreSQL"
echo "========================================="

# Проверяем подключение к PostgreSQL
echo "Проверка подключения к PostgreSQL..."
if ! psql -h localhost -U postgres -d postgres -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ PostgreSQL не доступен на localhost:5432"
  echo ""
  echo "Варианты запуска PostgreSQL:"
  echo "1. Запустить через Docker:"
  echo "   docker run -d --name postgres-library \\"
  echo "     -e POSTGRES_PASSWORD=postgres \\"
  echo "     -e POSTGRES_DB=library_db \\"
  echo "     -p 5432:5432 \\"
  echo "     postgres:15"
  echo ""
  echo "2. Установить PostgreSQL локально:"
  echo "   Windows: https://www.postgresql.org/download/windows/"
  echo "   macOS: brew install postgresql"
  echo "   Ubuntu: sudo apt install postgresql postgresql-contrib"
  echo ""
  echo "Запустите PostgreSQL и попробуйте снова."
  exit 1
fi

echo "✅ PostgreSQL доступен"

# Создаем базу данных если её нет
echo "Создание базы данных library_db..."
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE library_db;" 2>/dev/null && echo "✅ База данных создана" || echo "��� База данных уже существует"

# Создаем все таблицы
echo "Создание таблиц..."
psql -h localhost -U postgres -d library_db << 'SQL'
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
SQL

echo "✅ Таблицы созданы"

# Создаем индексы
echo "Создание индексов..."
psql -h localhost -U postgres -d library_db << 'SQL'
CREATE INDEX IF NOT EXISTS "IDX_users_email" ON users(email);
CREATE INDEX IF NOT EXISTS "IDX_users_role" ON users(role);
CREATE INDEX IF NOT EXISTS "IDX_books_library" ON books("libraryId");
CREATE INDEX IF NOT EXISTS "IDX_books_available" ON books("isAvailable");
CREATE INDEX IF NOT EXISTS "IDX_support_requests_user" ON support_requests("userId");
CREATE INDEX IF NOT EXISTS "IDX_support_requests_is_active" ON support_requests("isActive");
CREATE INDEX IF NOT EXISTS "IDX_messages_support_request" ON messages("supportRequestId");
CREATE INDEX IF NOT EXISTS "IDX_messages_read_at" ON messages("readAt");
CREATE INDEX IF NOT EXISTS "IDX_messages_sent_at" ON messages("sentAt");
SQL

echo "✅ Индексы созданы"

# Добавляем тестовые данные
echo "Добавление тестовых данных..."
psql -h localhost -U postgres -d library_db << 'SQL'
-- Пользователи (пароль для всех: password123)
INSERT INTO users (email, "passwordHash", name, role) VALUES
  ('admin@library.com', '\$2b\$10\$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Администратор', 'admin'),
  ('manager@library.com', '\$2b\$10\$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Менеджер', 'manager'),
  ('client@library.com', '\$2b\$10\$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Клиент', 'client')
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
SQL

echo "✅ Тестовые данные добавлены"

echo ""
echo "========================================="
echo " База данных успешно настроена! ���"
echo "========================================="
echo ""
echo "Данные для входа:"
echo "• Администратор: admin@library.com / password123"
echo "• Менеджер: manager@library.com / password123"
echo "• Клиент: client@library.com / password123"
echo ""
echo "Таблицы в базе данных:"
psql -h localhost -U postgres -d library_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
