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
		   "smart-helper",
	        "auth/Library/2.0.0-crypto", 
	        "auth/Library/2.0.0-sha1", 
	        "auth/Library/2.0.0-hmac", 
	        "auth/OAuth/Token", 
	        "auth/OAuth/Cookie", 
	        "auth/OAuth/Request", 
	        "auth/OAuth/Consumer", 
	        "auth/OAuth/SignatureMethod", 
	        "auth/OAuth/SignatureMethod/Plaintext", 
	        "auth/OAuth/SignatureMethod/HMAC-SHA1", 
	        "auth/OAuth/SignatureMethod/SHA1", 
	        "auth/OAuth/Service", 
	        "auth/OAuth/Service/OAuthSandbox", 
	        "auth/OAuth/Service/Smart", 
	        "auth/OAuth/Utilities"
		  )                        // 3rd party script's (like jQueryUI), in resources folder

.models("account", "activity", "pha", "record")                           // loads files in models folder 

.controllers("main", "patient_list", "pha", "record")                      // loads files in controllers folder

.views()                            // adds views to be added to build


	 