#!/bin/bash

echo "=== ПРОВЕРКА API ==="
echo "Ожидание 20 секунд для запуска..."
sleep 20

echo -e "\n1. Проверка здоровья:"
for i in {1..10}; do
  if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ API работает!"
    curl -s http://localhost:3000/api/health | grep -o '"status":"[^"]*"' || echo "Нестандартный ответ"
    break
  else
    echo "⏳ Попытка $i/10: Ожидание API..."
    sleep 3
  fi
done

echo -e "\n2. Тест эндпоинтов библиотек:"
ENDPOINTS=(
  "/api/libraries"
  "/api/libraries/books/popular"
  "/api/libraries/stats/counts"
  "/api/libraries/1/books"
)

for endpoint in "${ENDPOINTS[@]}"; do
  echo -n "  GET $endpoint: "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint" 2>/dev/null || echo "ERR")
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
    echo "✅ HTTP $STATUS"
    # Покажем первые 100 символов ответа
    RESPONSE=$(curl -s "http://localhost:3000$endpoint" | head -c 100)
    echo "    Ответ: $RESPONSE..."
  elif [ "$STATUS" = "ERR" ]; then
    echo "❌ Не удалось подключиться"
  else
    echo "⚠️  HTTP $STATUS"
  fi
done

echo -e "\n=== ПРОВЕРКА ЗАВЕРШЕНА ==="
