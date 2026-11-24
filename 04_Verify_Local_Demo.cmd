@echo off
echo STEP 04 - Check the running demo in a second window
call "%~dp0Start Finance Demo.cmd" --action verify --port 8876
echo.
pause
