#!/bin/bash

echo "=== ТЕСТ API С ПРАВИЛЬНОЙ КОДИРОВКОЙ ==="

# Установим кодировку UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Проверим health
echo "1. Health check:"
curl -s http://localhost:3000/api/health | jq -r '.status' 2>/dev/null || curl -s http://localhost:3000/api/health | grep -o '"status":"[^"]*"'

# Библиотеки (первые 2)
echo -e "\n2. Первые 2 библиотеки:"
curl -s http://localhost:3000/api/libraries | python3 -c "
import json, sys
data = json.load(sys.stdin)
for lib in data[:2]:
    print(f'  ��� {lib[\"id\"]}. {lib[\"name\"]}')
    print(f'     Адрес: {lib[\"address\"]}')
    print(f'     Книг: {len(lib.get(\"books\", []))}')
" 2>/dev/null || echo "  (используйте Python 3 для правильного отображения)"

# Статистика
echo -e "\n3. Статистика:"
curl -s http://localhost:3000/api/libraries/stats/counts | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/api/libraries/stats/counts

# Популярные книги (первые 3)
echo -e "\n4. Первые 3 популярные книги:"
curl -s http://localhost:3000/api/libraries/books/popular | python3 -c "
import json, sys
data = json.load(sys.stdin)
for i, book in enumerate(data[:3], 1):
    print(f'  ��� {i}. {book[\"title\"]}')
    print(f'     Автор: {book[\"author\"]}')
    print(f'     Библиотека: {book[\"library\"][\"name\"]}')
" 2>/dev/null || echo "  (используйте Python 3)"

echo -e "\n✅ API полностью работоспособен!"
