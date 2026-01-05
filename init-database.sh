#!/bin/bash
echo "Инициализация базы данных..."

# Запускаем SQL команды напрямую
docker-compose exec -T postgres psql -U library_user -d library_db << 'SQL'
-- Быстрая инициализация
INSERT INTO libraries (name, address) VALUES 
('Библиотека №1', 'ул. Центральная, 1'),
('Библиотека №2', 'ул. Школьная, 15')
ON CONFLICT DO NOTHING;

INSERT INTO books (library_id, title, author) VALUES
(1, 'Первая книга', 'Автор 1'),
(1, 'Вторая книга', 'Автор 2'),
(2, 'Третья книга', 'Автор 3')
ON CONFLICT DO NOTHING;

SELECT 'Готово!' as status;
SQL

echo "Проверка..."
curl -s http://localhost:3000/api/libraries
