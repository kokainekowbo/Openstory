@echo off
echo.
echo ========================================
echo 🎙️ AVVIO SERVER OPENVOICE PER OPENSTORY
echo ========================================
echo.

REM Controlla se Python è installato
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python non trovato! Installa Python 3.8+ prima di continuare.
    echo 📥 Scarica da: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python trovato
echo.

REM Vai alla directory del server OpenVoice
cd /d "%~dp0OpenVoice_server"

REM Controlla se la directory esiste
if not exist "openvoice" (
    echo ❌ Directory OpenVoice_server non trovata!
    echo 🔄 Clonando repository OpenVoice...
    cd /d "%~dp0"
    git clone https://github.com/ValyrianTech/OpenVoice_server.git
    cd OpenVoice_server
)

echo 📁 Directory OpenVoice: %cd%
echo.

REM Installa dipendenze se non esistono
if not exist "venv" (
    echo 🔧 Creazione ambiente virtuale Python...
    python -m venv venv
    echo ✅ Ambiente virtuale creato
)

echo 🔧 Attivazione ambiente virtuale...
call venv\Scripts\activate.bat

echo 📦 Installazione dipendenze...
pip install -r requirements.txt

echo.
echo 🎙️ Avvio server OpenVoice su porta 8000...
echo 📍 URL: http://localhost:8000
echo 🔄 Premi Ctrl+C per fermare il server
echo.

REM Avvia il server
cd openvoice
python openvoice_server.py

echo.
echo 🛑 Server OpenVoice fermato
pause 