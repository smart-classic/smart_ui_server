steal.plugins('smart_common')	
    .css('smart_ui_server')  // loads styles
    .resources()

    .models("../../smart_common/models/account", 
	    "../../smart_common/models/activity", 
	    "../../smart_common/models/app_manifest", 
	    "../../smart_common/models/pha", 
	    "../../smart_common/models/record")
	    //"../../smart_common/models/alert"

    .controllers("main", "proxy_main",
		 "../../smart_common/controllers/patient_list", 
		 "../../smart_common/controllers/pha", 
		 "../../smart_common/controllers/record") 
		 //"../../smart_common/controllers/alert_list"

.views()                            // adds views to be added to build


	 