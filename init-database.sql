-- Создание таблиц для Book Library Aggregator

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
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  "userId" INTEGER NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "hasNewMessages" BOOLEAN NOT NULL DEFAULT false
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
  _id SERIAL PRIMARY KEY,
  "authorId" INTEGER NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  "text" TEXT NOT NULL,
  "sentAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt" TIMESTAMP,
  "supportRequestId" INTEGER NOT NULL REFERENCES support_requests(_id) ON DELETE CASCADE
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_books_library ON books("libraryId");
CREATE INDEX IF NOT EXISTS idx_books_available ON books("isAvailable");
CREATE INDEX IF NOT EXISTS idx_support_user ON support_requests("userId");
CREATE INDEX IF NOT EXISTS idx_support_active ON support_requests("isActive");
CREATE INDEX IF NOT EXISTS idx_messages_request ON messages("supportRequestId");
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages("readAt");
