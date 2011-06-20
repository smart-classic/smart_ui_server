

steal.plugins(
    'smart_common')
.css('smart_ui_server_mobile')  // loads styles
.resources( "smart-helper" )                        // 3rd party script's (like jQueryUI), in resources folder
    .models("../../smart_common/models/account", 
	    "../../smart_common/models/activity", 
	    "../../smart_common/models/pha", 
	    "../../smart_common/models/record")
    .controllers("main", "patient_list", "pha", "record")                      // loads files in controllers folder

.views()                            // adds views to be added to build


	 