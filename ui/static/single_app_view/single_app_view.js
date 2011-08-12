steal.plugins('smart_common')	
    .css("../smart_ui_server/smart_ui_server")
    .models("../../smart_common/models/account", 
	    "../../smart_common/models/activity", 
	    "../../smart_common/models/pha", 
	    "../../smart_common/models/record")

    .controllers("main",
		 "../../smart_common/controllers/pha", 
		 "../../smart_common/controllers/record")
    .resources("smart-helper-overrides")

.views()                            // adds views to be added to build


	 