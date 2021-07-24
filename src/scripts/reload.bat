echo "%cd%"
echo "git pull"
git pull

timeout /t 1

echo "pm2 restart all"
pm2 restart all

timeout /t 2