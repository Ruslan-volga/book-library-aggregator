#!/bin/bash

echo "=== ПРЯМОЕ ДОБАВЛЕНИЕ ДАННЫХ ЧЕРЕЗ БАЗУ ==="

CONTAINER_ID=$(docker-compose ps -q postgres)

# Добавим библиотеки напрямую в PostgreSQL
docker exec $CONTAINER_ID psql -U library_user -d library_db -c "
INSERT INTO library (name, address, description) VALUES
('Центральная библиотека', 'ул. Ленина, 1', 'Главная библиотека города'),
('Библиотека искусств', 'ул. Пушкина, 10', 'Специализированная библиотека'),
('Детская библиотека', 'пр. Мира, 5', 'Библиотека для детей')
ON CONFLICT DO NOTHING;
"

# Проверим
docker exec $CONTAINER_ID psql -U library_user -d library_db -c "SELECT * FROM library;"

echo "✅ Библиотеки добавлены"
