@echo off
title StyleUp SDGs - Menjalankan Platform
color 0A

echo ========================================================
echo        MEMULAI PLATFORM STYLEUP SDGS INDONESIA
echo ========================================================
echo.
echo 1. Pastikan MySQL di XAMPP Control Panel sudah AKTIF (Start MySQL).
echo 2. Menjalankan Backend Server (Port 5000)...
start "StyleUp Backend API (Port 5000)" cmd /k "cd /d "%~dp0" && node server/index.js"

timeout /t 2 /nobreak >nul

echo 3. Menjalankan Frontend Vite (Port 5173)...
start "StyleUp Frontend (Port 5173)" cmd /k "cd /d "%~dp0" && npm run dev"

timeout /t 2 /nobreak >nul

echo 4. Membuka website di browser...
start http://localhost:5173

echo.
echo ========================================================
echo  Platform berhasil dijalankan!
echo  - Web Platform : http://localhost:5173
echo  - Backend API  : http://localhost:5000
echo ========================================================
echo.
echo Jangan tutup jendela Command Prompt yang terbuka agar server tetap berjalan.
echo Tekan tombol apa saja untuk menutup jendela peluncur ini...
pause >nul
