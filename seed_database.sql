-- Очищаем таблицы (если нужно)
TRUNCATE TABLE books, libraries RESTART IDENTITY CASCADE;

-- Добавляем библиотеки
INSERT INTO libraries (name, address, description, "createdAt", "updatedAt") VALUES 
('Центральная библиотека им. Пушкина', 'ул. Пушкина, 1', 'Главная библиотека города', NOW(), NOW()),
('Городская библиотека', 'ул. Ленина, 10', 'Культурно-образовательный центр', NOW(), NOW()),
('Детская библиотека', 'ул. Мира, 5', 'Библиотека для детей и подростков', NOW(), NOW()),
('Научная библиотека', 'пр. Науки, 25', 'Специализированная библиотека', NOW(), NOW());

-- Добавляем книги
INSERT INTO books (library_id, title, author, year, description, cover_image, is_available, total_copies, available_copies, "createdAt", "updatedAt") VALUES
(1, 'Война и мир', 'Лев Толстой', 1869, 'Роман-эпопея о русском обществе', NULL, true, 5, 5, NOW(), NOW()),
(1, 'Преступление и наказание', 'Фёдор Достоевский', 1866, 'Роман о психологии преступления', NULL, true, 3, 3, NOW(), NOW()),
(2, 'Хоббит', 'Джон Р. Р. Толкин', 1937, 'Приключения Бильбо Бэггинса', NULL, true, 4, 4, NOW(), NOW()),
(2, 'Властелин колец', 'Джон Р. Р. Толкин', 1954, 'Эпическая фантазия о Средиземье', NULL, true, 2, 2, NOW(), NOW()),
(3, 'Гарри Поттер и философский камень', 'Джоан Роулинг', 1997, 'Первая книга серии о юном волшебнике', NULL, true, 6, 6, NOW(), NOW()),
(4, '1984', 'Джордж Оруэлл', 1949, 'Антиутопический роман', NULL, true, 3, 3, NOW(), NOW()),
(4, 'Убить пересмешника', 'Харпер Ли', 1960, 'Роман о расовой несправедливости', NULL, true, 2, 2, NOW(), NOW());

-- Проверяем
SELECT '=== РЕЗУЛЬТАТ ===' as info;
SELECT 'Библиотеки:' as type, COUNT(*) as count FROM libraries
UNION ALL
SELECT 'Книги:' as type, COUNT(*) as count FROM books;

SELECT '=== БИБЛИОТЕКИ ===' as info;
SELECT id, name, address FROM libraries ORDER BY id;

SELECT '=== КНИГИ ===' as info;
SELECT id, title, author, library_id FROM books ORDER BY id;
