-- Очистка таблиц (опционально)
TRUNCATE TABLE books CASCADE;
TRUNCATE TABLE libraries CASCADE;

-- Добавление библиотек
INSERT INTO libraries (name, address, description, created_at, updated_at) VALUES
('Центральная библиотека', 'ул. Ленина, 1', 'Крупнейшая библиотека города с фондом более 1 млн книг', NOW(), NOW()),
('Библиотека им. Пушкина', 'ул. Пушкина, 10', 'Современная библиотека с электронным каталогом', NOW(), NOW()),
('Детская библиотека "Сказка"', 'пр. Мира, 5', 'Библиотека для детей и подростков', NOW(), NOW())
RETURNING id;

-- Добавление книг в первую библиотеку
INSERT INTO books (library_id, title, author, year, description, cover_image, is_available, total_copies, available_copies, created_at, updated_at) VALUES
(1, 'Война и мир', 'Лев Толстой', 1869, 'Роман-эпопея, описывающий русское общество в эпоху войн против Наполеона', 'war-and-peace.jpg', true, 5, 3, NOW(), NOW()),
(1, 'Преступление и наказание', 'Фёдор Достоевский', 1866, 'Роман о моральных дилеммах и раскаянии', 'crime-and-punishment.jpg', true, 3, 2, NOW(), NOW()),
(1, 'Анна Каренина', 'Лев Толстой', 1877, 'Роман о любви, браке и обществе', 'anna-karenina.jpg', true, 4, 1, NOW(), NOW());

-- Добавление книг во вторую библиотеку
INSERT INTO books (library_id, title, author, year, description, cover_image, is_available, total_copies, available_copies, created_at, updated_at) VALUES
(2, 'Евгений Онегин', 'Александр Пушкин', 1833, 'Роман в стихах, классика русской литературы', 'onegin.jpg', true, 6, 4, NOW(), NOW()),
(2, 'Мастер и Маргарита', 'Михаил Булгаков', 1967, 'Философский роман о добре и зле', 'master-margarita.jpg', true, 2, 0, NOW(), NOW()),
(2, 'Отцы и дети', 'Иван Тургенев', 1862, 'Роман о конфликте поколений', 'fathers-sons.jpg', true, 3, 3, NOW(), NOW());

-- Добавление книг в третью библиотеку
INSERT INTO books (library_id, title, author, year, description, cover_image, is_available, total_copies, available_copies, created_at, updated_at) VALUES
(3, 'Незнайка на Луне', 'Николай Носов', 1965, 'Приключения Незнайки в космосе', 'neznayka-moon.jpg', true, 5, 5, NOW(), NOW()),
(3, 'Волшебник Изумрудного города', 'Александр Волков', 1939, 'Сказочная повесть для детей', 'emerald-city.jpg', true, 4, 2, NOW(), NOW()),
(3, 'Приключения Буратино', 'Алексей Толстой', 1936, 'Сказка о деревянном мальчике', 'buratino.jpg', true, 3, 1, NOW(), NOW());
