

steal.plugins(
	 'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/controller/history',  // subscribe to history
	'jquery/view/ejs',				// client side templates
	'jquery/controller/view',		// lookup views with the controller's name
	'jquery/model',					// Ajax wrappers
	'jquery/dom/fixture',			// simulated Ajax requests
	'jquery/dom/form_params')		// form data helper
.css('smart_ui_server_mobile')  // loads styles

.resources("../../smart_common/resources/ObjTree",
		   "../../smart_common/resources/xml2json",
		   "../../smart_common/resources/utils",
		   "../../smart_common/resources/jquery.inputHintOverlay",
		   "../../smart_common/resources/jquery.form",
		   "../../smart_common/resources/class",
		   "../../smart_common/resources/jschannel",
		   "../../smart_common/resources/smart-api-container",
		   "../../smart_common/resources/smart-helper",
	           "smart-helper"
		  )                        // 3rd party script's (like jQueryUI), in resources folder

    .models("../../smart_common/models/account", 
	    "../../smart_common/models/activity", 
	    "../../smart_common/models/pha", 
	    "../../smart_common/models/record",
	    "../../smart_common/models/alert")                           // loads files in models folder 

    .controllers("main", "patient_list", "pha", "record", "alert_list")                      // loads files in controllers folder

.views()                            // adds views to be added to build


	 