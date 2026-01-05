-- Сначала посмотрим структуру
\d books;

-- Потом попробуем вставить с разными вариантами имен полей
INSERT INTO books ("libraryId", title, author, year, description, "isAvailable", "totalCopies", "availableCopies") VALUES
(1, 'Война и мир', 'Лев Толстой', 1869, 'Роман-эпопея', true, 5, 5);

-- Или попробуем другой вариант
-- INSERT INTO books (library_id, title, author) VALUES (1, 'Test', 'Author');
