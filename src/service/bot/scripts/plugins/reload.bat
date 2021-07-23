pm2 stop "FictionBot2"

git pull
timeout /t 2
pm2 start "start.js" --name "FictionBot2" -- -discord -gamebot