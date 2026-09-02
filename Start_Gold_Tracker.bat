@echo off
title Gold Tracker Server
echo Starting Gold Tracker Live Server at http://localhost:5000 ...
start "" "http://localhost:5000"
python server.py
pause
