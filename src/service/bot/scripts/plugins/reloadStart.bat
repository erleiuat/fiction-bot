timeout /t 1

echo "start cmd.exe /c pm2 stop all"
start cmd.exe /c pm2 stop all

timeout /t 5

echo "%cd%"
echo "git pull"
git pull

timeout /t 2

echo "pm2 start "%cd%\start.js" --name "FictionBot2" -- -discord -gamebot"
pm2 start "%cd%\start.js" --name "FictionBot2" -- -discord -gamebot