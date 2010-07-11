/*
 * JMVC Controller for the SMArt bootstrap
 *
 * Ben Adida (ben.adida@childrens.harvard.edu)
 * Arjun Sanyal (arjun.sanyal@childrens.harvard.edu)
 * Josh Mandel (joshua.mandel@childrens.harvard.edu)
 */

MainController = MVC.Controller.extend('main', {
  load: function(params) {
      ACCOUNT = new Account(ACCOUNT_ID); // init the account via model
      SMART = new SMART_CONTAINER(function(app) {
	  // this is called when a new app is started
	  // credentials are bogus for now
	  return {'credentials' : 'foobar',
		  	  'record_info' : {
		      'full_name' : RecordController.CURRENT_RECORD.label,
		      'id' : RecordController.CURRENT_RECORD.record_id
		  }};
      });

      this.setup();
  },
    
  setup: function(params) {
    RecordController.dispatch('setup');
	PHAController.dispatch('setup');

    // init the "app tabs"
    $("#app_selector").tabs();

    // Attach the Healthfeed click handler
    $('[href=\'#_healthfeed_tab_panel_hidden\']').click(function(){ HealthfeedController.dispatch('index'); });
    $('[href=\'#_patient_search_tab_panel_hidden\']').click(function(){ PatientSearchController.dispatch('index'); });
    $('#manage_apps_link').click(function(){ PHAController.dispatch('index'); });
    // Run Healthfeed
    
    PatientSearchController.dispatch('index');
    

    $(window).resize(function() {
    	
    	var $elt = $("#app_content_iframe").is(":visible")? 
    			   $("#app_content_iframe") : $("#app_content");
    	
        $elt.hide();        	
        $elt.css("height", $("#bigbody").height()- 25);
        $elt.css("width", $("#bigbody").width()-175); // hard-wired width to match left-column width in CSS.  Sigh...  -JM
        $elt.show();    		
    });
    
    $(window).resize();
    $('#app_content_iframe').load( 
    		function() {
		    $('#app_content_iframe').show();
		    $('#app_content_iframe').focus();
		    $(window).resize();
    		});

  }

});