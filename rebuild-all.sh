#!/bin/bash

echo "��� Очистка..."
docker-compose down -v
docker system prune -f

echo "��� Установка зависимостей локально..."
cd backend && npm install --legacy-peer-deps
cd ../frontend && npm install --legacy-peer-deps
cd ..

echo "��� Сборка Docker образов..."
docker-compose build --no-cache

echo "��� Запуск контейнеров..."
docker-compose up -d

echo "⏳ Ожидание запуска..."
sleep 20

echo "��� Проверка статуса..."
docker-compose ps

echo ""
echo "��� Проверьте доступность:"
echo "   Frontend:       http://localhost"
echo "   Backend API:    http://localhost:3000"
echo "   Swagger Docs:   http://localhost:3000/api-docs"
echo ""
echo "��� Логи backend:"
docker-compose logs backend --tail=30
