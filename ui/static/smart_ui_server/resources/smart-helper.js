SMART_HELPER  = {};

// calls back with appropriate context:  user, record, and credentials.
SMART_HELPER.handle_record_info = function(activity, callback) { 
    callback( {
    	'user' : {
    		'id': ACCOUNT_ID,
    		'full_name': FULLNAME
    	},
     	'record' : {
    		'full_name' : RecordController.CURRENT_RECORD.label,
    		'id' : RecordController.CURRENT_RECORD.record_id
	    },
	    'credentials': {
	    	'token': activity.session_tokens.rest_token,
	    	'secret': activity.session_tokens.rest_secret,
	    	'oauth_cookie':  activity.session_tokens.oauth_cookie
	    }
	});
};

// calls back wtih the response to an API call.  
// (implemented as passthrough to a back-end REST server)
SMART_HELPER.handle_api = function(activity, message, callback) {
    var params = {'smart_oauth_token': activity.session_tokens.connect_token};
	
    var params_array = [];
    for (var k in params) { 
	params_array.push (k+'="'+encodeURIComponent(params[k])+'"');
    }
    
    var header =  "OAuth " + params_array.join(", ");
    
    $.ajax({
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", header);
			},
		    dataType: "text",
		    url: SMART_PASSTHROUGH_SERVER+message.func,
		    contentType: message.contentType,
		    data: message.params,
		    type: message.method,
			success: callback,
			error: function(data) {
			    	  alert("error");
			      }
	});
};

// Brings an already-running activity back to the screen
SMART_HELPER.handle_resume_activity = function(activity, callback) {
	OpenAjax.hub.publish("request_visible_element",  $(activity.iframe));
	callback();
};

/* Begins a new activity based on the input "activity" variable,
   which provides activity.name and activity.app
   Pseudocode:
    1.  Resolve the activity name + app to an URL
    2.  Requset OAuth credentials for the new activity (Ajax call to /accounts/apps/records/launch)
    3.  Store these OAuth credentials in activity.session_tokens
    4.  Open an IFRAME to the activity's URL.
    5.  Display the IFRAME
*/
SMART_HELPER.handle_start_activity = function(activity, callback) {
    	var account_id_enc = encodeURIComponent(ACCOUNT_ID);
    	var record_id_enc = encodeURIComponent(RecordController.CURRENT_RECORD.record_id);
    	
    	var get_tokens = function() {
        	var app_email_enc = encodeURIComponent(resolved_activity.app);
        	activity.resolved_activity = resolved_activity;


		OpenAjax.hub.publish("request_visible_element",  $("#loading_div"));

        	$.ajax({
              		url: "/accounts/"+account_id_enc+"/apps/"+app_email_enc+"/records/"+record_id_enc+"/launch",
    			data: null,
    			type: "GET",
    			dataType: "text",
    			success: 
    			      function(data) {
        				d  = xotree.parseXML(data);    		   
        				if (d.AccessToken.App["@id"] !== resolved_activity.app)
        					throw "Got back access tokens for a different app! " + resolved_activity.app +  " vs. " + d.AccessToken.App["@id"];
        				
        				activity.session_tokens = {
        						   connect_token:d.AccessToken.SMArtConnectToken, 
								   connect_secret: d.AccessToken.SMArtConnectSecret,
								   api_base: d.AccessToken.SMArtContainerAPIBase,
								   rest_token:d.AccessToken.RESTToken, 
								   rest_secret: d.AccessToken.RESTToken,
								   
        										   oauth_cookie: d.AccessToken.OAuthCookie};        				

        				var interpolation_args = {
        			    		  'record_id' : RecordController.RECORD_ID,
        			    		  'account_id' : ACCOUNT_ID
        			    		  };

        			  	  startURL = interpolate_url_template(resolved_activity.url, interpolation_args);
        			  	  RecordController.APP_ID = resolved_activity.app;
        			  	  var frame_id = "app_content_iframe_"+randomUUID();
        			  	  $('#app_content_iframe_holder').append('<iframe SEAMLESS src="'+startURL+'" class="activity_iframe" id="'+frame_id+'"> </iframe>');
					  
        			  	  var frame = $("#"+frame_id);
					  OpenAjax.hub.publish("request_grow_app", frame);
					  OpenAjax.hub.publish("request_visible_element",  $("#loading_div"));

					  var frame_load = function(){
					      frame.data("loaded", true);
						 OpenAjax.hub.publish("request_grow_app",  frame);
					      };

					  frame.load(frame_load);
					  setTimeout(function(){
						  if (frame.data("loaded") !== true){ 
						      frame_load();
						      $("#main_canvas").prepend("<div class='activity_iframe'><b>SMArt app loading error</b>.  Could not load: " + startURL+'</div>');
						  }
					      },10000);
					  

        				  callback( frame[0]);
    			      },
    			error: function(data) {
    			    	  // error handler
    			    	  err = data;
    			    	  alert("error fetching token xml " + data);
    			      }
        	});    		
    	}
    	
    	var resolved_activity= new Activity({name: activity.name, app_id: activity.app, callback: get_tokens});
};