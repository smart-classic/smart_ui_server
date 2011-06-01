//steal/js smart_ui_server/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('showcase/showcase.html',{to: 'showcase'});
});
