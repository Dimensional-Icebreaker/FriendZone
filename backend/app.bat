@echo off
cd ..\frontend
call npm run build
cd ..\backend
call flask run