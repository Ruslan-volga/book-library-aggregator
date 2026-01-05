-- Обновляем библиотеки
UPDATE libraries SET 
  name = 'Центральная библиотека им. Пушкина',
  address = 'ул. Пушкина, 1',
  description = 'Главная библиотека города'
WHERE id = 1;

UPDATE libraries SET 
  name = 'Городская библиотека',
  address = 'ул. Ленина, 10',
  description = 'Культурно-образовательный центр'
WHERE id = 2;

UPDATE libraries SET 
  name = 'Детская библиотека',
  address = 'ул. Мира, 5',
  description = 'Библиотека для детей и подростков'
WHERE id = 3;

-- Обновляем книги
UPDATE books SET
  title = 'Гарри Поттер и философский камень',
  author = 'Джоан Роулинг',
  description = 'Первая книга серии о юном волшебнике'
WHERE id = 5;

UPDATE books SET
  title = 'Властелин колец',
  author = 'Джон Р. Р. Толкин',
  description = 'Эпическая фантазия о Средиземье'
WHERE id = 4;

UPDATE books SET
  title = 'Хоббит',
  author = 'Джон Р. Р. Толкин',
  description = 'Приключения Бильбо Бэггинса'
WHERE id = 3;

UPDATE books SET
  title = 'Преступление и наказание',
  author = 'Фёдор Достоевский',
  description = 'Роман о психологии преступления'
WHERE id = 2;

UPDATE books SET
  title = 'Война и мир',
  author = 'Лев Толстой',
  description = 'Роман-эпопея о русском обществе'
WHERE id = 1;
