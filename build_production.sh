cd ui/static
./js smart_ui_server/scripts/build.js

cd ../..
sed -i 's/=development/=production/g' templates/ui/index.html
