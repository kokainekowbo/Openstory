@echo off
echo ===============================================
echo       🚀 AVVIO OPENSTORY GENERATOR 🚀
echo ===============================================
echo.
echo 📁 Navigazione alla directory corretta...
cd /d "%~dp0openstory-app"

echo.
echo 🔧 Verifica configurazione...
if not exist .env (
    echo ❌ ERRORE: File .env non trovato!
    echo 📝 Creazione file .env con configurazione base...
    echo REACT_APP_OPENROUTER_API_KEY=TUA_API_KEY_QUI > .env
    echo REACT_APP_API_TIMEOUT=120000 >> .env
    echo.
    echo ⚠️  IMPORTANTE: Modifica il file .env con la tua vera API key!
    pause
)

echo.
echo ✅ Configurazione OK!
echo 🌐 Avvio server di sviluppo...
echo 📍 App disponibile su: http://localhost:3001
echo.
echo 🎯 ROUTES DISPONIBILI:
echo    • / - Generatore principale
echo    • /demo - Storie demo  
echo    • /test - Test API
echo    • /about - Info app
echo.
echo 🔑 Assicurati che l'API key OpenRouter sia configurata in .env
echo.

start "" http://localhost:3001
npm start

pause 