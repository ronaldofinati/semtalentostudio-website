@echo off
cd /d "%~dp0"
title SemTalento Studio
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nao encontrado. Instale em https://nodejs.org
  pause
  exit /b 1
)
if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo Erro ao instalar dependencias.
    pause
    exit /b 1
  )
)

rem Melhora deteccao de alteracoes no Windows (especialmente em D:\)
set WATCHPACK_POLLING=true
set WATCHPACK_POLLING_INTERVAL=1000
set CHOKIDAR_USEPOLLING=true
set CHOKIDAR_INTERVAL=1000

echo.
echo ========================================
echo   SemTalento Studio - servidor local
echo ========================================
echo.
echo O navegador abrira sozinho em: http://localhost:3000/pt
echo Aguarde a primeira compilacao se a pagina demorar.
echo.
echo Hot reload: mantenha esta janela aberta.
echo Para parar: Ctrl+C
echo.

rem Espera o Next responder e so entao abre o browser (com aspas corretas)
start "AbrirSite" /min "%~dp0abrir-navegador.bat"

call npm run dev
echo.
pause