steal.plugins('smart_common')		// form data helper
.css('resources/jqueryui/css/smoothness/jquery-ui-1.8.13.custom')  // loads styles	
.css('showcase')  // loads styles
.resources(
    "jqueryui/js/jquery-ui-1.8.13.custom.min"
)
.models("../../smart_common/models/account", 
	"../../smart_common/models/record", 
	"../../smart_common/models/app_manifest", 
	"../../smart_common/models/activity", 
	"../../smart_common/models/pha", 
	"../../smart_common/models/alert")

.controllers("main","patient_list", "pha", "record")
.views()                            // adds views to be added to build


	 