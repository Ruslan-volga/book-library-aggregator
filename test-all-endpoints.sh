#!/bin/bash

echo "=== ТЕСТ ВСЕХ ЭНДПОИНТОВ API ==="

BASE_URL="http://localhost:3000"

echo "1. Health check:"
curl -s "$BASE_URL/api/health" | grep -o '"status":"[^"]*"'

echo -e "\n2. Все библиотеки:"
curl -s "$BASE_URL/api/libraries" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/libraries"

echo -e "\n3. Популярные книги:"
curl -s "$BASE_URL/api/libraries/books/popular" | head -c 200

echo -e "\n4. Статистика:"
curl -s "$BASE_URL/api/libraries/stats/counts"

echo -e "\n5. Поиск книг (Толстой):"
curl -s "$BASE_URL/api/libraries/books/search?query=Толстой" | head -c 200

echo -e "\n6. Новые книги:"
curl -s "$BASE_URL/api/libraries/books/new" | head -c 200

echo -e "\n7. Книги по автору (Булгаков):"
curl -s "$BASE_URL/api/libraries/books/author/%D0%91%D1%83%D0%BB%D0%B3%D0%B0%D0%BA%D0%BE%D0%B2" | head -c 200

echo -e "\n8. Книги библиотеки 1:"
curl -s "$BASE_URL/api/libraries/1/books"

echo -e "\n9. Общие книги:"
curl -s "$BASE_URL/api/libraries/common/books" | head -c 200

echo -e "\n✅ Все тесты завершены!"
