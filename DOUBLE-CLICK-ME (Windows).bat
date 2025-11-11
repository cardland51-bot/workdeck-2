\
    @echo off
    title WorkDeck Starter
    echo.
    echo This will open WorkDeck on your computer.
    echo First time only, it will install files (takes a few minutes).
    echo.
    echo If a browser page does not open automatically, copy the link shown into your browser.
    echo.
    echo Checking Node.js...
    where node >nul 2>nul
    if errorlevel 1 (
      echo Node.js is required. Opening download page...
      start https://nodejs.org/
      echo After installing, double-click this file again.
      pause
      exit /b
    )
    echo Installing dependencies (first run only)...
    call npm i
    echo Starting WorkDeck (development server)...
    call npm run dev
    echo.
    echo When you're done, press Ctrl+C in this window to stop.
    pause
