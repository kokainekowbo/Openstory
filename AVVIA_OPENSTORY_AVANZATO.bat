@echo off
setlocal enabledelayedexpansion
cls

REM Colori per l'output
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
set "GREEN=%ESC%[32m"
set "YELLOW=%ESC%[33m"
set "RED=%ESC%[31m"
set "BLUE=%ESC%[34m"
set "CYAN=%ESC%[36m"
set "WHITE=%ESC%[37m"
set "BOLD=%ESC%[1m"
set "RESET=%ESC%[0m"

:MENU
cls
echo.
echo %BOLD%%CYAN%========================================%RESET%
echo %BOLD%%CYAN%       🎭 OPENSTORY LAUNCHER 🎭%RESET%
echo %BOLD%%CYAN%========================================%RESET%
echo.
echo %YELLOW%Seleziona un'opzione:%RESET%
echo.
echo %GREEN%[1]%RESET% 🚀 Avvia OpenStory (Modalità Standard)
echo %GREEN%[2]%RESET% 🔧 Avvia OpenStory + Installa Dipendenze
echo %GREEN%[3]%RESET% 🌐 Apri solo il Browser (se server già attivo)
echo %GREEN%[4]%RESET% 📦 Solo Installazione Dipendenze
echo %GREEN%[5]%RESET% 🧹 Pulizia e Ricostruzione Completa
echo %GREEN%[6]%RESET% ℹ️  Informazioni di Sistema
echo %GREEN%[0]%RESET% ❌ Esci
echo.
set /p choice=%YELLOW%Inserisci la tua scelta (0-6): %RESET%

if "%choice%"=="1" goto START_STANDARD
if "%choice%"=="2" goto START_WITH_INSTALL
if "%choice%"=="3" goto OPEN_BROWSER
if "%choice%"=="4" goto INSTALL_ONLY
if "%choice%"=="5" goto CLEAN_BUILD
if "%choice%"=="6" goto SYSTEM_INFO
if "%choice%"=="0" goto EXIT
goto MENU

:START_STANDARD
echo.
echo %BOLD%%GREEN%🚀 AVVIO MODALITÀ STANDARD%RESET%
echo %CYAN%========================================%RESET%
call :SETUP_ENVIRONMENT
call :START_SERVER
goto END

:START_WITH_INSTALL
echo.
echo %BOLD%%GREEN%🔧 AVVIO CON INSTALLAZIONE%RESET%
echo %CYAN%========================================%RESET%
call :SETUP_ENVIRONMENT
call :INSTALL_DEPENDENCIES
call :START_SERVER
goto END

:OPEN_BROWSER
echo.
echo %BOLD%%GREEN%🌐 APERTURA BROWSER%RESET%
echo %CYAN%========================================%RESET%
echo %YELLOW%Tentativo di apertura browser su localhost:3000...%RESET%
start http://localhost:3000
echo %GREEN%✅ Browser aperto!%RESET%
timeout /t 3 /nobreak >nul
goto MENU

:INSTALL_ONLY
echo.
echo %BOLD%%GREEN%📦 INSTALLAZIONE DIPENDENZE%RESET%
echo %CYAN%========================================%RESET%
call :SETUP_ENVIRONMENT
call :INSTALL_DEPENDENCIES
echo %GREEN%✅ Installazione completata!%RESET%
pause
goto MENU

:CLEAN_BUILD
echo.
echo %BOLD%%GREEN%🧹 PULIZIA E RICOSTRUZIONE%RESET%
echo %CYAN%========================================%RESET%
call :SETUP_ENVIRONMENT
echo %YELLOW%🗑️ Rimozione node_modules e build...%RESET%
if exist "node_modules" rmdir /s /q "node_modules"
if exist "build" rmdir /s /q "build"
echo %YELLOW%📥 Reinstallazione dipendenze...%RESET%
npm install
echo %YELLOW%🔨 Creazione build di produzione...%RESET%
npm run build
echo %GREEN%✅ Pulizia e ricostruzione completata!%RESET%
pause
goto MENU

:SYSTEM_INFO
echo.
echo %BOLD%%GREEN%ℹ️ INFORMAZIONI DI SISTEMA%RESET%
echo %CYAN%========================================%RESET%
echo %YELLOW%📍 Directory corrente:%RESET% %cd%
echo.
echo %YELLOW%🟢 Node.js:%RESET%
node --version 2>nul || echo %RED%❌ Non installato%RESET%
echo.
echo %YELLOW%📦 NPM:%RESET%
npm --version 2>nul || echo %RED%❌ Non installato%RESET%
echo.
echo %YELLOW%💾 Spazio disco disponibile:%RESET%
dir /-c | find "bytes free"
echo.
echo %YELLOW%🌐 Porte in uso (3000-3010):%RESET%
netstat -an | findstr ":300"
pause
goto MENU

:SETUP_ENVIRONMENT
echo %YELLOW%📍 Configurazione ambiente...%RESET%
cd /d "%~dp0openstory-app"
echo %GREEN%✅ Directory: %cd%%RESET%

echo %YELLOW%🔧 Verifica Node.js...%RESET%
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Node.js non trovato!%RESET%
    echo %YELLOW%📥 Scarica Node.js da: https://nodejs.org/%RESET%
    pause
    exit /b 1
)
echo %GREEN%✅ Node.js OK%RESET%
goto :eof

:INSTALL_DEPENDENCIES
echo %YELLOW%📦 Verifica dipendenze...%RESET%
if not exist "node_modules" (
    echo %YELLOW%📥 Installazione dipendenze in corso...%RESET%
    npm install
    if errorlevel 1 (
        echo %RED%❌ Errore durante l'installazione!%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%✅ Dipendenze installate%RESET%
) else (
    echo %GREEN%✅ Dipendenze già presenti%RESET%
)
goto :eof

:START_SERVER
echo.
echo %BOLD%%GREEN%🌟 AVVIO OPENSTORY...%RESET%
echo.
echo %CYAN%💡 L'applicazione si aprirà automaticamente nel browser%RESET%
echo %CYAN%💡 URL: http://localhost:3000%RESET%
echo %CYAN%⏹️  Per fermare: Ctrl+C in questa finestra%RESET%
echo.

REM Verifica se la porta 3000 è già in uso
netstat -an | findstr ":3000.*LISTENING" >nul
if not errorlevel 1 (
    echo %YELLOW%⚠️ Porta 3000 già in uso!%RESET%
    set /p continue=%YELLOW%Continuare comunque? (y/n): %RESET%
    if /i not "!continue!"=="y" goto MENU
)

echo %YELLOW%🚀 Avvio server...%RESET%
start /B npm start

echo %YELLOW%⏳ Attendere avvio server...%RESET%
timeout /t 6 /nobreak >nul

echo %YELLOW%🌐 Apertura browser...%RESET%
start http://localhost:3000

echo.
echo %BOLD%%GREEN%✨ OpenStory è in esecuzione!%RESET%
echo.
echo %CYAN%📖 Buona creazione di storie!%RESET%
echo %CYAN%🎭 Genera personaggi fantastici!%RESET%
echo %CYAN%✨ Lascia volare la fantasia!%RESET%
echo.
goto :eof

:END
echo.
echo %YELLOW%Premi un tasto per tornare al menu o chiudi la finestra per uscire...%RESET%
pause >nul
goto MENU

:EXIT
echo.
echo %BOLD%%CYAN%Grazie per aver usato OpenStory! 🎭✨%RESET%
echo %YELLOW%Arrivederci!%RESET%
timeout /t 2 /nobreak >nul
exit

endlocal 