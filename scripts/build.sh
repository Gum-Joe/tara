# Tara build script
# Installs and compiles modules
# TODO: use Gulp

# Vars & functions
export NODE_ENV="development"
export INSTALL_COMMAND="npm i"

echo "Building tara..."
echo "Building root..."
npm install

echo "Building packages..."
cd ./src/packages
echo "Packages:"
ls
echo ""
cd tara-address-bar
npm install
yarn build
cd ../tara-core
npm install
yarn build
cd ../tara-explorer
npm install
yarn build
cd ../tara-file-operations
npm install 
yarn build
cd ../tara-right-click-menu
npm install
yarn build
cd ../one-fluent-theme
npm install
yarn build

echo "Modules done, bootstrapping..."
cd ../../..
yarn run bootstrap

echo ""
echo "Building semantic UI..."
cp ./node_modules/semantic-ui/tasks ./src/semantic/tasks
cd ./src/semantic
../../node_modules/.bin/gulp build

echo ""
echo "Done!"
exit 0