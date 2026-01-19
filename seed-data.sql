-- Тестовые пользователи (пароль для всех: password123)
INSERT INTO users (email, "passwordHash", name, role) VALUES
('admin@library.com', '$2b$10$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Администратор системы', 'admin'),
('manager@library.com', '$2b$10$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Менеджер поддержки', 'manager'),
('client@library.com', '$2b$10$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Иван Иванов', 'client'),
('client2@library.com', '$2b$10$B9exYIT9GRfS8Rg/.z/hQO81.1oA8Ucqb8d6I8R.JYQ5b0wKjY3rW', 'Мария Петрова', 'client')
ON CONFLICT (email) DO NOTHING;

-- Библиотеки
INSERT INTO libraries (name, address, description) VALUES
('Центральная библиотека им. Пушкина', 'Москва, ул. Пушкина, 10', 'Крупнейшая библиотека города'),
('Научная библиотека МГУ', 'Москва, Ленинские горы, 1', 'Университетская библиотека'),
('Детская библиотека №1', 'Санкт-Петербург, Невский пр., 20', 'Библиотека для детей')
ON CONFLICT DO NOTHING;

-- Книги
INSERT INTO books ("libraryId", title, author, year, description, "totalCopies", "availableCopies") VALUES
(1, 'Война и мир', 'Лев Толстой', 1869, 'Роман-эпопея', 5, 5),
(1, 'Преступление и наказание', 'Фёдор Достоевский', 1866, 'Философский роман', 3, 3),
(1, 'Анна Каренина', 'Лев Толстой', 1877, 'Роман о любви и обществе', 4, 4),
(2, 'Мастер и Маргарита', 'Михаил Булгаков', 1967, 'Мистический роман', 6, 6),
(2, 'Тихий Дон', 'Михаил Шолохов', 1940, 'Эпопея о казачестве', 2, 2),
(3, 'Гарри Поттер и философский камень', 'Дж. К. Роулинг', 1997, 'Книга о юном волшебнике', 10, 10),
(3, 'Приключения Незнайки', 'Николай Носов', 1954, 'Детская сказка', 8, 8)
ON CONFLICT DO NOTHING;
