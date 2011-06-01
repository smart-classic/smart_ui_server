steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',  // subscribe to OpenAjax.hub
	'jquery/controller/history',  // subscribe to history
	'jquery/view/ejs',				// client side templates
	'jquery/model',					// Ajax wrappers
	'jquery/dom/fixture',			// simulated Ajax requests
	'jquery/dom/form_params')		// form data helper

.resources("ObjTree",
	   "xml2json",
	   "utils",
	   "jquery.inputHintOverlay",
	   "jquery.form",
	   "class",
	   "jschannel",
	   "smart-api-container",
	   "smart-helper"
	  )
    .models("account", "activity", "pha", "record","alert")
.views()                            // adds views to be added to build


	 