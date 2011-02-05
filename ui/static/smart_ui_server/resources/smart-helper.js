SMART_HELPER  = {};

SMART_HELPER.handle_adjust_size = function(activity, newSize) { 
    var i = $(activity.iframe);
    i.data("need_size", newSize);
    $(window).resize();
};


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
        			  	  $('#main_canvas').append('<iframe SEAMLESS src="'+startURL+'" class="activity_iframe" id="'+frame_id+'" width="90%" height="90%"> </iframe>');
					  
        			  	  var frame = $("#"+frame_id);
					  frame.hide();
					  frame.load(function(){
						 OpenAjax.hub.publish("request_visible_element",  frame);
						 var w=$("html").width()-$('#app_selector').get(0).clientWidth-10;
						 var h=$("html").height()- $('#header').height()-10;
						 frame.width(w);
						 frame.height(h);

					      });
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