

steal.plugins(
    'smart_common')
.css('smart_ui_server_mobile')  // loads styles
.resources("../../smart_common/resources/smart-helper",
	   "smart-helper" )                        // local overrides to SMART.get_iframe
    .models("../../smart_common/models/account", 
	    "../../smart_common/models/activity", 
	    "../../smart_common/models/app_manifest", 
	    "../../smart_common/models/pha", 
	    "../../smart_common/models/record")
    .controllers("main", "patient_list", "pha", "../../smart_common/controllers/record")                      // loads files in controllers folder

.views()                            // adds views to be added to build


	 