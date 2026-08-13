@echo off
echo Starting MOON Minecraft Server Web Store...
start http://localhost:8080
python -m http.server 8080
pause
