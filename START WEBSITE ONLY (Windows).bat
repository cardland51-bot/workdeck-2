\
    @echo off
    setlocal
    title WorkDeck - Start Website Only (Preview)
    echo ===============================================
    echo      WorkDeck - Website Only (Preview)
    echo ===============================================
    echo This serves the built website at http://localhost:4173
    echo NOTE: Uploads/list may not work without the API server.
    echo.
    where node >nul 2>nul
    if errorlevel 1 (
      echo Node.js is required. Opening download page...
      start https://nodejs.org/
      echo After install finishes, double-click this file again.
      pause
      exit /b
    )
    call npm i
    call npm run build
    call npm run preview
