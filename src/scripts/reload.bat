timeout /t 5

echo "%cd%"
echo "git pull"
git pull

echo "pm2 restart all"
pm2 restart all

timeout /t 2