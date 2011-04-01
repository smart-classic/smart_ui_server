steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',  // subscribe to OpenAjax.hub
	'jquery/controller/history',  // subscribe to history
	'jquery/view/ejs',				// client side templates
	'jquery/model',					// Ajax wrappers
	'jquery/dom/fixture',			// simulated Ajax requests
	'jquery/dom/form_params')		// form data helper
	
.css('smart_ui_server')  // loads styles

.resources("ObjTree",
		   "xml2json",
		   "utils",
		   "jquery.inputHintOverlay",
		   "jquery.form",
		   "class",
		   "jschannel",
		   "smart-api-container",
		   "smart-helper"
		  )                        // 3rd party script's (like jQueryUI), in resources folder

    .models("account", "activity", "pha", "record","alert")                           // loads files in models folder 

    .controllers("main","proxy_main", "patient_list", "pha", "record", "alert_list")                      // loads files in controllers folder

.views()                            // adds views to be added to build


	 