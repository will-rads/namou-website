@echo off
REM Pull latest v3/ and assets/ from faxation/Namou-main,
REM then commit and push to will-rads/namou-website.
REM Double-click this file or run it from this folder.

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo === Cloning faxation/Namou-main ===
if exist _tmp_faxation rmdir /s /q _tmp_faxation
git clone --depth 1 https://github.com/faxation/Namou-main.git _tmp_faxation
if errorlevel 1 goto :error

echo.
echo === Replacing local v3/ and assets/ ===
if exist v3 rmdir /s /q v3
if exist assets rmdir /s /q assets
xcopy /e /i /q _tmp_faxation\v3 v3 >nul
xcopy /e /i /q _tmp_faxation\assets assets >nul
rmdir /s /q _tmp_faxation

echo.
echo === Committing and pushing ===
git add v3 assets
git diff --cached --quiet
if not errorlevel 1 (
  echo No changes to commit. Faxation repo matches local.
  goto :done
)
git commit -m "Sync v3 and assets from faxation/Namou-main"
if errorlevel 1 goto :error
git push origin main
if errorlevel 1 goto :error

:done
echo.
echo === Done. Live site will redeploy on Vercel in ~30 seconds. ===
pause
exit /b 0

:error
echo.
echo === Error. See output above. ===
pause
exit /b 1
