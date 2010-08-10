/*
 * JMVC Controller for the SMArt bootstrap
 *
 * Ben Adida (ben.adida@childrens.harvard.edu)
 * Arjun Sanyal (arjun.sanyal@childrens.harvard.edu)
 * Josh Mandel (joshua.mandel@childrens.harvard.edu)
 */

SMART_HELPER  = {};

SMART_HELPER.tokens_by_app = {};
SMART_HELPER.creds_and_info_generator = function(app, callback) { 
    callback( {'credentials' : 'foobar',
     	    'record_info' : {
		'full_name' : RecordController.CURRENT_RECORD.label,
		'id' : RecordController.CURRENT_RECORD.record_id
	    }
	});
};

//todo: this fn should take app_emai, for per-call token management
SMART_HELPER.api = function(app_id, message, callback) {
    var app = jQuery.grep(PHAController.phas, function(pha) {return (pha.id === app_id);})[0];

    var os = new OAuthServiceSmart(
                  {consumer_key: app.data.consumer_key, 
                   consumer_secret: app.data.secret, 
                   token_key: SMART_HELPER.tokens_by_app[app.id].token, 
                   token_secret: SMART_HELPER.tokens_by_app[app.id].secret, });

    var request = os.getSignedRequest({method: message.method,
				       url: SMART_API_SERVER+message.func,
				       query:message.params,
				       contentType: message.contentType
	});
    
    	$.ajax({
		beforeSend: function(xhr) {
		    var request_headers = request.getRequestHeaders();
		    for (var header in request_headers) {
			xhr.setRequestHeader(header, request_headers[header]);
		    }},
		    dataType: "text",
		    url: SMART_API_SERVER+message.func,
//		    contentType: message.contentType, //  todo: THIS BREAKS THINGS (better in jQuery 1.4?) -JM 
		    data: message.params,
		    type: request.getMethod(),
			success: callback,
			error: function(data) {
			    	  alert("error");
			      }
	});
};

SMART_HELPER.launch_app = function(app, account_id, record_id, callback) {
    	var account_id_enc = encodeURIComponent(account_id);
    	var record_id_enc = encodeURIComponent(record_id);
    	var app_email_enc = encodeURIComponent(app.id);

    	
    	$.ajax({
          		url: "/smart_api/accounts/"+account_id_enc+"/apps/"+app_email_enc+"/records/"+record_id_enc+"/launch",
			data: null,
			type: "GET",
			dataType: "text",
			success: 
			      function(data) {
    				d  = MVC.Tree.parseXML(data);    				
    				if (d.AccessToken.App["@id"] !== app.id)
    					throw "Got back access tokens for a different app! " + app.id +  " vs. " + d.AccessToken.App["@id"];
    				SMART_HELPER.tokens_by_app[app.id] = {token:d.AccessToken.Token, secret: d.AccessToken.Secret};


    				callback();
			      },
			error: function(data) {
			    	  // error handler
			    	  err = data;
			    	  alert("error fetching token xml " + data);
			      }
    	});    		
};



MainController = MVC.Controller.extend('main', {
  load: function(params) {      
      ACCOUNT = new Account(ACCOUNT_ID); // init the account via model
      SMART = new SMART_CONTAINER(SMART_HELPER);
      this.setup();
  },
    
  setup: function(params) {
    RecordController.dispatch('setup');
	PHAController.dispatch('setup');
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

    $.address.change(function(event) {
    	if (event.value === "manage_apps")
    	{
    		PHAController.dispatch('index');
    	}
    	if (event.value === "_patient_search_tab_panel_hidden")	
    	{
    		PatientSearchController.dispatch('index');
    	}
    	if (event.value.match(/^app\//))	
    	{
    		PHAController.dispatch('hash_change', event);
    	}

    });

    
  }

});