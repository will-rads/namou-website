@echo off
REM Pull the live site from faxation/Namou-main into the repo root,
REM then commit and push to will-rads/namou-website.
REM Double-click this file or run it from this folder.
REM
REM Faxation now serves the site from the repo root (no /v3/ subfolder).
REM We sync: index.html, robots.txt, sitemap.xml, and folders
REM   assets css js data buy sell invest broker about contact
REM We keep our own: vercel.json, .gitignore, v2/, v4/, docs/, README.md

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo === Cloning faxation/Namou-main ===
if exist _tmp_faxation rmdir /s /q _tmp_faxation
git clone --depth 1 https://github.com/faxation/Namou-main.git _tmp_faxation
if errorlevel 1 goto :error

echo.
echo === Replacing managed folders ===
for %%D in (assets css js data buy sell invest broker about contact) do (
  if exist %%D rmdir /s /q %%D
  if exist _tmp_faxation\%%D xcopy /e /i /q _tmp_faxation\%%D %%D >nul
)

echo.
echo === Copying managed root files ===
for %%F in (index.html robots.txt sitemap.xml) do (
  if exist _tmp_faxation\%%F copy /y _tmp_faxation\%%F %%F >nul
)

rmdir /s /q _tmp_faxation

echo.
echo === Committing and pushing ===
git add assets css js data buy sell invest broker about contact index.html robots.txt sitemap.xml 2>nul
git diff --cached --quiet
if not errorlevel 1 (
  echo No changes to commit. Faxation repo matches local.
  goto :done
)
git commit -m "Sync site from faxation/Namou-main"
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
