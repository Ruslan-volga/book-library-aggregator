#!/bin/bash

echo "��� Очистка предыдущих контейнеров..."
docker-compose down -v

echo "��� Сборка Docker образов..."
docker-compose build

echo "��� Запуск контейнеров..."
docker-compose up -d

echo "⏳ Ожидание запуска сервисов..."
sleep 10

echo "��� Проверка статуса контейнеров..."
docker-compose ps

echo ""
echo "✅ Готово! Проект запущен в Docker контейнерах."
echo ""
echo "��� Доступные сервисы:"
echo "   Frontend:       http://localhost"
echo "   Backend API:    http://localhost:3000"
echo "   Swagger Docs:   http://localhost:3000/api-docs"
echo "   PostgreSQL:     localhost:5432"
echo ""
echo "��� Логи:"
echo "   docker-compose logs -f backend"
echo "   docker-compose logs -f frontend"
echo "   docker-compose logs -f postgres"
