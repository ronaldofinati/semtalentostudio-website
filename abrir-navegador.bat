@echo off
setlocal
set URL=http://localhost:3000/pt
for /L %%i in (1,1,60) do (
  curl.exe -s -o NUL -m 2 http://127.0.0.1:3000/pt >NUL 2>&1
  if not errorlevel 1 (
    start "" "%URL%"
    exit /b 0
  )
  ping -n 2 127.0.0.1 >NUL
)
start "" "%URL%"
exit /b 0