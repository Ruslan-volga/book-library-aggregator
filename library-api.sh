#!/bin/bash

case "$1" in
  "start")
    docker-compose up -d
    echo "Сервисы запускаются..."
    ;;
  "stop")
    docker-compose down
    echo "Сервисы остановлены"
    ;;
  "status")
    docker-compose ps
    ;;
  "logs")
    docker-compose logs -f
    ;;
  "seed")
    ./seed-data.sh
    ;;
  "test")
    ./test-all-endpoints.sh
    ;;
  "health")
    curl -s http://localhost:3000/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/api/health
    ;;
  "libraries")
    curl -s http://localhost:3000/api/libraries | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/api/libraries
    ;;
  "books")
    curl -s "http://localhost:3000/api/libraries/books/popular" | python3 -m json.tool 2>/dev/null || curl -s "http://localhost:3000/api/libraries/books/popular"
    ;;
  *)
    echo "Использование: $0 {start|stop|status|logs|seed|test|health|libraries|books}"
    echo "  start   - запустить все сервисы"
    echo "  stop    - остановить все сервисы"
    echo "  status  - показать статус контейнеров"
    echo "  logs    - показать логи в реальном времени"
    echo "  seed    - добавить тестовые данные"
    echo "  test    - протестировать все эндпоинты"
    echo "  health  - проверить здоровье API"
    echo "  libraries - получить список библиотек"
    echo "  books   - получить популярные книги"
    ;;
esac
