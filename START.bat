@echo off
echo 🚀 Avviando OpenStory...
cd /d "%~dp0openstory-app"
start /B npm start
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo ✨ OpenStory avviato! Browser aperto su localhost:3000
pause 