#!/bin/bash

echo "=== ДОБАВЛЕНИЕ ТЕСТОВЫХ ДАННЫХ ==="

# Ждем запуск API
sleep 10

echo "1. Добавляем библиотеки..."
curl -X POST http://localhost:3000/api/libraries/admin/libraries \
  -H "Content-Type: application/json" \
  -d '{"name":"Центральная библиотека им. Ленина","address":"ул. Ленина, 1","description":"Главная библиотека города"}' 2>/dev/null

curl -X POST http://localhost:3000/api/libraries/admin/libraries \
  -H "Content-Type: application/json" \
  -d '{"name":"Библиотека искусств","address":"ул. Пушкина, 10","description":"Специализированная библиотека по искусству"}' 2>/dev/null

curl -X POST http://localhost:3000/api/libraries/admin/libraries \
  -H "Content-Type: application/json" \
  -d '{"name":"Детская библиотека","address":"пр. Мира, 5","description":"Библиотека для детей и подростков"}' 2>/dev/null

echo -e "\n2. Добавляем книги..."
# Книги для первой библиотеки
curl -X POST http://localhost:3000/api/libraries/admin/books \
  -H "Content-Type: application/json" \
  -d '{
    "libraryId": 1,
    "title": "Война и мир",
    "author": "Лев Толстой",
    "year": 1869,
    "description": "Роман-эпопея, описывающий русское общество в эпоху войн против Наполеона",
    "isAvailable": true,
    "totalCopies": 5,
    "availableCopies": 5
  }' 2>/dev/null

curl -X POST http://localhost:3000/api/libraries/admin/books \
  -H "Content-Type: application/json" \
  -d '{
    "libraryId": 1,
    "title": "Преступление и наказание",
    "author": "Фёдор Достоевский",
    "year": 1866,
    "description": "Психологический роман о преступлении и моральной ответственности",
    "isAvailable": true,
    "totalCopies": 3,
    "availableCopies": 3
  }' 2>/dev/null

# Книги для второй библиотеки
curl -X POST http://localhost:3000/api/libraries/admin/books \
  -H "Content-Type: application/json" \
  -d '{
    "libraryId": 2,
    "title": "Мастер и Маргарита",
    "author": "Михаил Булгаков",
    "year": 1967,
    "description": "Мистический роман о добре и зле, любви и творчестве",
    "isAvailable": true,
    "totalCopies": 4,
    "availableCopies": 4
  }' 2>/dev/null

curl -X POST http://localhost:3000/api/libraries/admin/books \
  -H "Content-Type: application/json" \
  -d '{
    "libraryId": 2,
    "title": "Сто лет одиночества",
    "author": "Габриэль Гарсиа Маркес",
    "year": 1967,
    "description": "Роман в жанре магического реализма",
    "isAvailable": true,
    "totalCopies": 2,
    "availableCopies": 2
  }' 2>/dev/null

# Книги для третьей библиотеки
curl -X POST http://localhost:3000/api/libraries/admin/books \
  -H "Content-Type: application/json" \
  -d '{
    "libraryId": 3,
    "title": "Гарри Поттер и философский камень",
    "author": "Джоан Роулинг",
    "year": 1997,
    "description": "Первая книга серии о юном волшебнике",
    "isAvailable": true,
    "totalCopies": 6,
    "availableCopies": 6
  }' 2>/dev/null

echo -e "\n3. Проверяем добавленные данные..."
echo "Библиотеки:"
curl -s http://localhost:3000/api/libraries | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/api/libraries

echo -e "\nКниги библиотеки 1:"
curl -s "http://localhost:3000/api/libraries/1/books"

echo -e "\nПопулярные книги:"
curl -s "http://localhost:3000/api/libraries/books/popular"

echo -e "\nСтатистика:"
curl -s "http://localhost:3000/api/libraries/stats/counts"

echo -e "\n✅ Тестовые данные добавлены!"
