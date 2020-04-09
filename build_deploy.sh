
cd /Users/gkibilov/dev/git/SGK-Joke-UI
npm i
npm run build
rm -r -f /Users/gkibilov/dev/git/SGK-Joker/src/main/resources/public
mkdir /Users/gkibilov/dev/git/SGK-Joker/src/main/resources/public
cp -r dist/* /Users/gkibilov/dev/git/SGK-Joker/src/main/resources/public