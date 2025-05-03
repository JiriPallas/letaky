@echo off
cd /d %~dp0
set /p message=Ange commit-meddelande: 
git add .
git commit -m "%message%"
git push
pause
