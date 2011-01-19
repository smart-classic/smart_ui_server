SMART_HELPER  = {};

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

SMART_HELPER.handle_api = function(activity, message, callback) {
    var os = new OAuthServiceSmart(
                  {consumer_key: activity.resolved_activity.consumer_key, 
                   consumer_secret: "", 
                   token_key: activity.session_tokens.connect_token, 
                   token_secret: activity.session_tokens.connect_secret });

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
		    url: SMART_PASSTHROUGH_SERVER+message.func,
		    contentType: message.contentType,
		    data: message.params,
		    type: request.getMethod(),
			success: callback,
			error: function(data) {
			    	  alert("error");
			      }
	});
};

SMART_HELPER.handle_resume_activity = function(activity, callback) {
	OpenAjax.hub.publish("request_visible_element",  $(activity.iframe));
	callback();
};

SMART_HELPER.handle_start_activity = function(activity, callback) {
    	var account_id_enc = encodeURIComponent(ACCOUNT_ID);
    	var record_id_enc = encodeURIComponent(RecordController.CURRENT_RECORD.record_id);
    	
    	var get_tokens = function() {
        	var app_email_enc = encodeURIComponent(resolved_activity.app);
        	activity.resolved_activity = resolved_activity;


		var loading_div = $("#loading_div");
		if (loading_div.length == 0) {
		    loading_div = $('<div class="activity_iframe" id="loading_div" width="90%" height="90%"> Loading... </div>');
		    $('#main_canvas').append(loading_div);
		}
		OpenAjax.hub.publish("request_visible_element",  loading_div);

        	$.ajax({
              		url: "/smart_api/accounts/"+account_id_enc+"/apps/"+app_email_enc+"/records/"+record_id_enc+"/launch",
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
        			  	  $('#main_canvas').append('<iframe src="'+startURL+'" class="activity_iframe" id="'+frame_id+'" width="90%" height="90%"> </iframe>');
        			  	  var frame = $("#"+frame_id);
        			  	  $(window).resize();
        			  	  OpenAjax.hub.publish("request_visible_element",  frame);
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