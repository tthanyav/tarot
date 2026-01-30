@echo off
REM Script to update version before deployment

echo Current version info:
type version.js
echo.
echo.

REM Get current date and time
for /f "tokens=1-3 delims=/" %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a:%%b)

echo New timestamp: %mydate% %mytime%
echo.

REM Ask for version number
set /p version="Enter new version (e.g., 1.0.2) or press Enter to keep current: "

if "%version%"=="" (
    echo Keeping current version, updating timestamp only...
    powershell -Command "(gc version.js) -replace 'const LAST_UPDATED = .*', 'const LAST_UPDATED = \"%mydate% %mytime%\";' | Out-File -encoding ASCII version.js"
) else (
    echo Updating to version %version%...
    powershell -Command "(gc version.js) -replace 'const APP_VERSION = .*', 'const APP_VERSION = \"%version%\";' | Out-File -encoding ASCII version.js"
    powershell -Command "(gc version.js) -replace 'const LAST_UPDATED = .*', 'const LAST_UPDATED = \"%mydate% %mytime%\";' | Out-File -encoding ASCII version.js"
)

echo.
echo Updated version info:
type version.js
echo.
echo Done! Now commit and push to deploy.
pause
