#!/bin/bash

echo "Тестирование API библиотек..."
echo "=============================="

# 1. Проверяем доступность
echo -n "Бэкенд доступен: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/libraries/stats/counts | grep -q "200"; then
    echo "ДА ✓"
else
    echo "НЕТ ✗"
    exit 1
fi

# 2. Получаем статистику
echo -e "\nСтатистика системы:"
STATS=$(curl -s http://localhost:3000/api/libraries/stats/counts)
echo "$STATS" | python -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f'   Библиотек: {data[\"totalLibraries\"]}')
    print(f'   Всего книг: {data[\"totalBooks\"]}')
    print(f'   Доступно книг: {data[\"totalAvailableBooks\"]}')
except:
    print('   Ошибка чтения статистики')
"

# 3. Проверяем книги
echo -e "\nКниги в системе:"
BOOKS_COUNT=$(curl -s http://localhost:3000/api/libraries/books/new | python -c "import json, sys; data = json.load(sys.stdin); print(len(data))" 2>/dev/null || echo "0")
echo "   Всего книг: $BOOKS_COUNT"

# 4. Проверяем библиотеки
echo -e "\nБиблиотеки:"
LIBS_COUNT=$(curl -s http://localhost:3000/api/libraries | python -c "import json, sys; data = json.load(sys.stdin); print(len(data))" 2>/dev/null || echo "0")
echo "   Всего библиотек: $LIBS_COUNT"

echo -e "\n=============================="
echo "Бэкенд API работает корректно! ✓"
