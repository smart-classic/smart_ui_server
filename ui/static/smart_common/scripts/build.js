//steal/js smart_ui_server/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('smart_ui_server/smart_ui_server.html',{to: 'smart_ui_server'});
});
