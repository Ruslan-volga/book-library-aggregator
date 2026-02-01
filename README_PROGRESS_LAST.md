# Book Library Aggregator

**Дипломный проект - Полнофункциональная система управления библиотеками**

## ��� Статус проекта: ГОТОВ К ЗАЩИТЕ ✅

## ��� Быстрый запуск за 3 команды:

```bash
# 1. Запустить базу данных и бэкенд
docker-compose up -d

# 2. Запустить фронтенд
cd frontend
npm start

# 3. Открыть в браузере: http://localhost:3000
��� Демо1-доступ (вход без регистрации):
Email для входа	Роль	Что можно делать
admin@library.com	���️ Администратор	Полный доступ + админ-панель
manager@test.com	���‍��� Менеджер	Управление книгами и библиотеками
client1@test.com	��� Клиент	Просмотр и бронирование книг
Пароль: любой (для демо-режима)

✅ ЧТО РЕАЛИЗОВАНО:
���️ АРХИТЕКТУРА:
Fullstack: NestJS + React 18 + PostgreSQL

TypeScript на всех уровнях

Docker контейнеризация

Redux Toolkit для управления состоянием

Material-UI современный интерфейс

��� МОДУЛИ СИСТЕМЫ:
1. ��� Модуль пользователей
4 тестовых пользователя (admin, manager, 2 клиента)

Ролевой доступ (admin/manager/client)

JWT аутентификация + localStorage

2. ���️ Модуль библиотек
3 библиотеки с полной информацией

Центральная, Городская, Научная библиотеки

Адреса, телефоны, email

3. ��� Модуль книг
10 тестовых книг классической литературы

Распределение по библиотекам

Статус доступности (Доступна/Занята)

Связь книг с библиотеками (libraryId)

4. ��� Модуль чата техподдержки
WebSocket сервер в реальном времени

История сообщений

Статус подключения

Material-UI интерфейс чата

��� ИНТЕРФЕЙС ПОЛЬЗОВАТЕЛЯ:
��� Страницы:
Главная (Dashboard) - обзор системы, статистика

Чат поддержки - онлайн-чат с WebSocket

Админ-панель - управление пользователями

Страница библиотеки - просмотр книг по библиотекам

Вход в систему - аутентификация

��� Функционал:
Навигация с Material-UI AppBar

Защищенные маршруты по ролям

Отображение книг с карточками

Просмотр книг по библиотекам

Статистика системы в реальном времени

��� ТЕСТИРОВАНИЕ:
Unit тесты для Redux слайсов (auth, books)

Component тесты для React компонентов

Integration тесты для Redux store

Type тесты для TypeScript типов

Покрытие тестами: 70%+ ключевых модулей

СТРУКТУРА ПРОЕКТА:
text
book-library-aggregator/
├── backend/
│   ├── scripts/
│   │   ├── setup-database-windows.bat
│   │   ├── setup-database.sh
│   │   ├── setup-database.sql
│   ├── src/
│   │   ├── config/             
│   │   │   ├── data-source.ts
│   │   ├── migratons/             
│   │   │   ├── 1705610000000-CreateSupportTables.ts
│   │   ├── modules/             
│   │   │   ├── auth/
│   │   │   │   ├── dto/
│   │   │   │   ├── guards/
│   │   │   │   │   ├── ws-jwt.guard.ts
│   │   │   │   ├── strtegies/
│   │   │   ├── auth.module.ts
│   │   │   ├── books/
│   │   │   │   ├── dto/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── book.entity.ts
│   │   │   │   ├── books.controller.ts
│   │   │   │   ├── books.module.ts
│   │   │   │   ├── books.service.ts
│   │   │   ├── liraries/
│   │   │   │   ├── dto/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── book.entity.ts
│   │   │   │   ├── libraries.module.ts
│   │   │   ├── support/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── support-client.controller.ts
│   │   │   │   │   ├── support-common.controller.ts
│   │   │   │   │   ├── support-manager.controller.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── support-create-support-request.dto.ts
│   │   │   │   │   │   ├── send-message.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── message.entity.ts
│   │   │   │   │   │   ├── support-request.entity.ts
│   │   │   │   │   ├── interfaces/
│   │   │   │   │   │   ├── support-request.interface.ts
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── support-request.service.ts
│   │   │   │   │   ├── support.gateway.ts
│   │   │   │   │   ├── support.module.ts
│   │   │   │   │   ├── users/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── users.module.ts
│   │   │   │   ├── seeds/       
│   │   │   │   │   ├── run-seeds.ts     
│   │   │   │   ├── app.module.ts
│   │   │   │   ├── books.controller.ts
│   │   │   │   ├── main.ts         
│   │   │   ├── temp-nest\node_modules   
│   │   ├── .eslintrc.js
│   │   ├── .prettierrc
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── ormconfig.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── package.json.backup
│   │   ├── README.md
│   │   ├── tsconfig.build.json
│   │   ├── tsconfig.json        
│   ├── dist           
│   ├── frontend/
│   │   ├── _mocks_/              
│   │   │   ├── fileMock.js
│   │   ├── coverage/
│   │   │   ├── Icov-report/
│   │   │   │   ├── src/
│   │   │   │   │   ├── api/
│   │   │   │   │   │   ├── auth.api.ts.html
│   │   │   │   │   │   ├── client.ts.html
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── Admin
│   │   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   │   ├── UsersManagement.tsx.html
│   │   │   │   │   │   ├── BookSearch.tsx.html
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   ├── Navigation.tsx.html
│   │   │   │   │   ├── pages/
│   │   │   │   │   │   ├── AdminDashboard.tsx.html
│   │   │   │   │   │   ├── BookDetailPage.tsx.html
│   │   │   │   │   │   ├── BooksPage.tsx.html
│   │   │   │   │   │   ├── Dashboard.tsx.html
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   ├── LibrariesPage.tsx.html
│   │   │   │   │   │   ├── LibraryBooksPage.tsx.html
│   │   │   │   │   │   ├── LibraryDetailPage.tsx.html
│   │   │   │   │   │   ├── LoginPage.tsx.html
│   │   │   │   │   │   ├── SupportPage.tsx.tsx.html
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── Api.ts.html
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   ├── store/
│   │   │   │   │   │   ├── slices/
│   │   │   │   │   │   │   ├── authSlice.ts.html
│   │   │   │   │   │   │   ├── booksSlice.ts
│   │   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   │   ├── librariesSlice.ts
│   │   │   │   │   │   │   ├── support.slice.ts
│   │   │   │   │   │   │   ├── users.slice.ts.html
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   ├── index.ts.html
│   │   │   │   │   │   ├── store.ts.html
│   │   │   │   │   ├── App.tsx.html
│   │   │   │   │   ├── Auth.tsx.html
│   │   │   │   │   ├── index.html
│   │   │   │   ├── base.css
│   │   │   │   ├── block-navigation.js
│   │   │   │   ├── favicon.png
│   │   │   │   ├── index.html
│   │   │   │   ├── prettify.js
│   │   │   │   ├── sort-arrow-sprite.png
│   │   │   │   ├── sorter.js
│   │   │   ├── src/
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth.api.ts.html
│   │   │   │   │   ├── client.ts.html
│   │   │   │   │   ├── index.html
│   │   │   │   ├── components/
│   │   │   │   │   ├── Admin
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   ├── UsersManagement.tsx.html
│   │   │   │   │   ├── BookSearch.tsx.html
│   │   │   │   │   ├── index.html
│   │   │   │   │   ├── Navigation.tsx.html
│   │   │   │   ├── pages/
│   │   │   │   │   ├── AdminDashboard.tsx.html
│   │   │   │   │   ├── BookDetailPage.tsx.html
│   │   │   │   │   ├── BooksPage.tsx.html
│   │   │   │   │   ├── Dashboard.tsx.html
│   │   │   │   │   ├── index.html
│   │   │   │   │   ├── LibrariesPage.tsx.html
│   │   │   │   │   ├── LibraryBooksPage.tsx.html
│   │   │   │   │   ├── LibraryDetailPage.tsx.html
│   │   │   │   │   ├── LoginPage.tsx.html
│   │   │   │   │   ├── SupportPage.tsx.html
│   │   │   │   ├── services/
│   │   │   │   │   ├── Api.ts.html
│   │   │   │   │   ├── index.html
│   │   │   │   ├── store/
│   │   │   │   │   ├── slices/
│   │   │   │   │   │   ├── authSlice.ts.html
│   │   │   │   │   │   ├── booksSlice.ts
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   ├── librariesSlice.ts
│   │   │   │   │   │   ├── support.slice.ts
│   │   │   │   │   │   ├── users.slice.ts.html
│   │   │   │   │   ├── index.html
│   │   │   │   │   ├── index.ts.html
│   │   │   │   │   ├── store.ts.html
│   │   │   │   ├── App.tsx.html
│   │   │   │   ├── Auth.tsx.html
│   │   │   │   ├── index.html
│   │   │   ├── base.css
│   │   │   ├── block-navigation.js
│   │   │   ├── favicon.png
│   │   │   ├── index.html
│   │   │   ├── prettify.js
│   │   │   ├── sort-arrow-sprite.png
│   │   │   ├── sorter.js
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── index.html.backup
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   ├── demo/
│   │   │   │   │   ├── authSlice.test.ts
│   │   │   │   │   ├── booksSlice.test.ts
│   │   │   │   │   ├── Component.test.tsx
│   │   │   │   │   ├── store.test.ts
│   │   │   │   │   ├── types.test.ts
│   │   │   ├── api
│   │   │   │   ├── auth.api.ts
│   │   │   │   ├── client.ts
│   │   │   ├── components
│   │   │   │   ├── Admin/
│   │   │   │   │   ├── UsersManagement.tsx
│   │   │   │   ├── Auth.jsx
│   │   │   │   ├── BookSearch.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   ├── pages/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── BookDetailPage.tsx
│   │   │   │   ├── BooksPage.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── LibrariesPage.tsx
│   │   │   │   ├── LibraryBooksPage.tsx
│   │   │   │   ├── LibraryDetailPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── SupportPage.tsx
│   │   │   ├── services/
│   │   │   │   ├── api.ts
│   │   │   ├── store/
│   │   │   │   ├── slices/
│   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   ├── authSlice.test.ts
│   │   │   │   │   │   ├── booksSlice.test.ts
│   │   │   │   │   ├── authSlice.ts
│   │   │   │   │   ├── booksSlice.ts
│   │   │   │   │   ├── authSlice.ts.backup
│   │   │   │   │   ├── librariesSlice.ts
│   │   │   │   │   ├── support.slice.ts
│   │   │   │   │   ├── users.slice.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── store.ts
│   │   │   ├── types/
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── user.ts
│   │   │   ├── App.css
│   │   │   ├── App.tsx
│   │   │   ├── App.tsx.backup
│   │   │   ├── App.tsx.backup2
│   │   │   ├── Auth.tsx
│   │   │   ├── index.css
│   │   │   ├── index.tsx
│   │   │   ├── index.tsx.backup
│   │   │   ├── setupTests.ts
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── .env.local
│   │   ├── App.tsx
│   │   ├── App.tsx.backup
│   │   ├── Auth.tsx
│   │   ├── Dockerfile
│   │   ├── index.tsx
│   │   ├── jest.config.json
│   │   ├── nginx.conf
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── package.json.backup
│   │   ├── setupProxy.js
│   │   ├── tsconfig.json
│   │   ├── node_modules
│   ├── .gitignor
│   ├── all_books.json
│   ├── books_correct.json
│   ├── books_utf8.json
│   ├── build-and-run.sh
│   ├── check-api.js
│   ├── check-api.sh
│   ├── check-db.sql
│   ├── create_users_table.sql
│   ├── create-indexes.sql
│   ├── create-tables.sql
│   ├── direct-seed.sh
│   ├── docker-compose.dev.yaml
│   ├── docker-compose.yml
│   ├── final_books.json
│   ├── final-report.md
│   ├── final-validation.sh
│   ├── fix_data.sql
│   ├── fix-errors.sh
│   ├── FYREADME.md
│   ├── init-database.sh
│   ├── init-database.sql
│   ├── insert_data.sql
│   ├── libraries.json
│   ├── library_auth.html
│   ├── library-api.sh
│   ├── library-demo.js
│   ├── monitor.js
│   ├── nest-cli.json
│   ├── package-lock.json
│   ├── package.json
│   ├── PROJECT_PROGRESS.md
│   ├── README_PROGRESS_LAST.md
│   ├── README.md
│   ├── rebuild-all.sh
│   ├── recreate_data_utf8.sql
│   ├── recreate_data.sql
│   ├── seed_database.sql
│   ├── seed-data.sh
│   ├── seed-data.sql
│   ├── seed-database.sql
│   ├── setup-postgres.sql
│   ├── simple_library_auth.html
│   ├── simple-test.js
│   ├── test_backend.sh
│   ├── test-all-endpoints.sh
│   ├── test-api-utf8.sh
│   ├── tsconfig.json



���️ ТЕХНОЛОГИЧЕСКИЙ СТЕК:
Frontend:
⚛️ React 18 + TypeScript

��� Material-UI + Emotion

���️ Redux Toolkit + React-Redux

��� React Router 6

��� Axios для API

��� Jest + Testing Library

Backend:
���️ NestJS + TypeScript

���️ PostgreSQL + TypeORM

��� JWT аутентификация

��� WebSocket для чата

��� Docker контейнеризация

��� Swagger документация

DevOps:
��� Docker + Docker Compose

���️ PostgreSQL в контейнере

⚙️ Настройка окружения через .env

��� КОМАНДЫ ДЛЯ ЗАПУСКА:
bash
# Полный запуск в Docker
docker-compose up -d

# Только база данных
docker-compose up -d postgres

# Запуск бэкенда (разработка)
cd backend
npm run start:dev

# Запуск фронтенда
cd frontend
npm start

# Запуск тестов
cd frontend
npm test

# Запуск тестов с покрытием
cd frontend
npm test -- --coverage
��� БАЗА ДАННЫХ:
Таблицы:
users - пользователи системы

libraries - библиотеки

books - книги с привязкой к библиотекам

support_requests - запросы в поддержку

messages - сообщения чата

Демо-данные:
��� 4 пользователя

���️ 3 библиотеки

��� 10 книг

��� 3 начальных сообщения в чате

��� КЛЮЧЕВЫЕ ФИЧИ ДЛЯ ЗАЩИТЫ:
Полный Fullstack цикл - от базы до интерфейса

Real-time WebSocket чат - живое общение

TypeScript типизация - надежность кода

Redux архитектура - предсказуемое состояние

Ролевой доступ - разграничение прав

Docker контейнеризация - легкий деплой

Юнит-тестирование - качество кода

Material Design - современный UI/UX

��� API ЭНДПОИНТЫ:
text
GET    /api/books           # Все книги
GET    /api/books/:id       # Конкретная книга
GET    /api/libraries       # Все библиотеки
GET    /api/libraries/:id   # Библиотека с книгами
GET    /api/users           # Пользователи (admin only)
POST   /api/auth/login      # Вход в систему
WS     /support            # WebSocket для чата
��� СКРИНШОТЫ СИСТЕМЫ:
Главная страница - статистика и обзор

Чат поддержки - онлайн-общение

Админ-панель - управление пользователями

Страница библиотеки - книги выбранной библиотеки

Форма входа - аутентификация

��� ДЛЯ ЗАЩИТЫ ДИПЛОМА:
Что показать:
Запуск системы (docker-compose up -d)

Вход под разными ролями

Демонстрация WebSocket чата

Просмотр книг по библиотекам

Redux DevTools - состояние приложения

Запуск тестов (npm test)

Что объяснить:
Архитектуру "модули по бизнес-логике"

TypeScript преимущества для Fullstack

Redux паттерн для управления состоянием

WebSocket vs REST для real-time

Docker преимущества для разработки

��� ДАЛЬНЕЙШЕЕ РАЗВИТИЕ:
Поиск книг - фильтры и полнотекстовый поиск

Бронирование книг - календарь и сроки

Уведомления - email/telegram оповещения

Мобильное приложение - React Native

Микросервисы - разделение на сервисы

Кэширование - Redis для производительности

��� КОНТАКТЫ И ПОДДЕРЖКА:
Студент: [Кадыров Руслан Талгатович]
Группа: [FFSMIDJS-83]
Руководитель: [Андрей Хомутов]
Год: 2024

✅ ПРОЕКТ СООТВЕТСТВУЕТ ВСЕМ ТРЕБОВАНИЯМ ДИПЛОМНОЙ РАБОТЫ:
Fullstack приложение

TypeScript типизация

База данных PostgreSQL

Docker контейнеризация

WebSocket реализация

Redux state management

Ролевая система

Юнит-тестирование

Документация

Готовность к защите

Проект завершен и готов к демонстрации!
