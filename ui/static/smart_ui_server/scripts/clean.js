//steal/js smart_ui_server/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/clean',function(){
	steal.clean('smart_ui_server/smart_ui_server.html',{indent_size: 1, indent_char: '\t'});
});
