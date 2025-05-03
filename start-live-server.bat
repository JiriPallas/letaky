@echo off
cd /d %~dp0
echo Startar live-server i: %cd%
live-server --port=5500
pause
