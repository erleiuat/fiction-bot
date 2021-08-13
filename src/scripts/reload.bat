timeout /t 1

echo "%cd%"
echo "git pull"
git pull

timeout /t 1

echo "npm install"
npm install

timeout /t 1

echo "pm2 restart all"
pm2 restart all