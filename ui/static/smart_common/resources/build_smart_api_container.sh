echo "// Autogenerated version (not guaranteed to be sequential): `git describe --abbrev=4 HEAD | sed -e "s/-/./g" | sed 's/^v\(.*\)/\1/'`" > smart-api-container-compiled.js
echo "// Autogenerated by concantenating several files: " >> smart-api-container-compiled.js
echo "// DO NOT EDIT. " >> smart-api-container-compiled.js

echo "(function(window){" >> smart-api-container-compiled.js

cat ../../jquery/jquery.js  >> smart-api-container-compiled.js
echo "\nvar $ = window.jQuery.noConflict(true), jQuery = $;" >> smart-api-container-compiled.js
cat jschannel.js smart-api-container.js  >> smart-api-container-compiled.js

echo "})(window);" >> smart-api-container-compiled.js
