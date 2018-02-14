# Tara build script
# Installs and compiles modules
# TODO: use Gulp

# Vars & functions
export NODE_ENV="development"

echo "Building tara..."
echo "Building root..."
yarn

echo "Building packages..."
cd ./src/packages
echo "Packages:"
ls
echo ""
cd tara-address-bar
yarn && yarn run build
cd ../tara-core
yarn && yarn run build
cd ../tara-explorer
yarn && yarn run build
cd ../tara-file-operations
yarn && yarn run build
cd ../tara-right-click-menu
yarn && yarn run build

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