include.resources("js/underscore-min.js",
		   "js/jquery-1.3.2.min.js",
		   "jquery-ui-1.7.2/js/jquery-ui-1.7.2.custom.min.js",
		   "js/jquery.tools.sans.tabs.min.js",
		   "js/xml2json.js",
		   "js/utils.js",
		   "js/ui.js",
		   "js/jquery.inputHintOverlay.js",
		   "js/jquery.form.js",
		   "js/jquery.address-1.2.2.min.js"
		  );

// Make sure you're actually using what's in here! 
include.plugins(
  'controller',
  'view',
  'dom/element',
  'io/ajax',
  'model/xml_rest'
);
include.models('account', 'pha', 'record');

include(function(){
    //runs after prior includes are loaded
    include('controllers');
 });

// SMArt
include.resources("js/smart-api-container.js");