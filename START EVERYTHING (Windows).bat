\
    @echo off
    setlocal
    title WorkDeck - One Click Start (Site + API)
    echo ===============================================
    echo   WorkDeck - One Click Start (Site + API)
    echo ===============================================
    echo.
    echo Checking Node.js...
    where node >nul 2>nul
    if errorlevel 1 (
      echo Node.js is required. Opening download page...
      start https://nodejs.org/
      echo After install finishes, double-click this file again.
      pause
      exit /b
    )
    echo.
    echo Step 1/3: Installing frontend dependencies (first run only)...
    call npm i
    if errorlevel 1 (
      echo ERROR installing frontend dependencies.
      pause
      exit /b
    )
    echo.
    echo Step 2/3: Building website...
    call npm run build
    if errorlevel 1 (
      echo ERROR building website.
      pause
      exit /b
    )
    echo.
    echo Step 3/3: Starting API on http://localhost:10000 ...
    cd demo-server
    call npm i
    if errorlevel 1 (
      echo ERROR installing API dependencies.
      pause
      exit /b
    )
    start "" cmd /c "npm start"
    cd ..
    timeout /t 2 >nul
    echo Opening browser at http://localhost:10000 ...
    start http://localhost:10000
    echo.
    echo All set! If the page doesn't open, copy this into your browser:
    echo   http://localhost:10000
    echo.
    echo Leave this window open while using WorkDeck. Press Ctrl+C to stop.
    pause
