@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 goto use_py
where python >nul 2>nul
if not errorlevel 1 goto use_python
echo Python 3.11 or newer is required. Install it, then run this file again.
pause
exit /b 1
:use_py
py -3 "%~dp0local_demo.py" %*
set "RC=%errorlevel%"
goto end
:use_python
python "%~dp0local_demo.py" %*
set "RC=%errorlevel%"
:end
if not "%RC%"=="0" pause
exit /b %RC%
