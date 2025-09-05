@echo off
echo ========================================
echo   PC-Master Monitoring System
echo ========================================
echo.

echo Запуск сервера...
start "PC-Master Server" cmd /k "node enhanced-server.js"

timeout /t 3 /nobreak > nul

echo Открытие монитора заявок...
start "" "http://localhost:8000/monitor"

echo.
echo ========================================
echo  Система мониторинга запущена!
echo ========================================
echo.
echo Сервер:    http://localhost:8000
echo Монитор:   http://localhost:8000/monitor
echo.
echo Нажмите любую клавишу для закрытия...
pause > nul