timeout /t 2

pm2 stop "FictionBot2"

timeout /t 2

CD "C:\Users\Eliver\Documents\GitHub\fiction-bot"

timeout /t 2

git pull

timeout /t 2

pm2 start "start.js" --name "FictionBot2" -- -discord -gamebot