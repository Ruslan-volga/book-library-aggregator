@echo off
echo =========================================
echo  Настройка базы данных PostgreSQL
echo =========================================
echo.
echo Этот скрипт для Windows. 
echo Убедитесь, что PostgreSQL установлен и запущен.
echo.
echo Для настройки базы выполните следующие шаги:
echo.
echo 1. Откройте pgAdmin или SQL Shell (psql)
echo.
echo 2. Подключитесь к PostgreSQL:
echo    Host: localhost
echo    Port: 5432
echo    Username: postgres
echo    Password: postgres
echo.
echo 3. Выполните SQL команды из файла:
echo    scripts\setup-database.sql
echo.
echo 4. Или используйте команды ниже:
echo.
pause
