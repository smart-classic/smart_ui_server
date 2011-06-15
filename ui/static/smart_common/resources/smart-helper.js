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
		'consumer_token': activity.resolved_activity.app,
	    	'oauth_cookie':  activity.session_tokens.oauth_cookie,
		'api_base': activity.session_tokens.api_base
	    },
        'browser_environment': 'desktop'
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
	type: message.method
    }).success(callback)
	.error(function(){alert("Error!");});
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
*/
SMART_HELPER.handle_start_activity = function(activity, callback) {    
    resolve_activity(activity)
	.pipe(get_tokens)
        .pipe(create_iframe)
	.pipe(function(new_iframe){
	    callback(new_iframe);
	    return $.Deferred().promise();
	});    
};


var resolve_activity = function(activity) {
    var dfd = $.Deferred();
    new Activity({
	name: activity.name, 
	app_id: activity.app, 
	callback: function(resolved) {
	    activity.resolved_activity = resolved;
	    dfd.resolve(activity);
	}});
    return dfd.promise();
};



var get_tokens = function(activity) {
    var dfd = $.Deferred();

    var app_email_enc = encodeURIComponent(activity.resolved_activity.app);
    var account_id_enc = encodeURIComponent(ACCOUNT_ID);
    var record_id_enc = encodeURIComponent(RecordController.CURRENT_RECORD.record_id);


    $.ajax({
        url: "/accounts/"+account_id_enc+"/apps/"+app_email_enc+"/records/"+record_id_enc+"/launch",
    	data: null,
    	type: "GET",
    	dataType: "text"})
    	.success(
    	    function(data) {
		d  = xotree.parseXML(data);    		   

		if (d.AccessToken.App["@id"] !== activity.resolved_activity.app)
        	    throw "Got back access tokens for a different app! " + 
		    resolved_activity.app +  
		    " vs. " + 
		    d.AccessToken.App["@id"];
		
		activity.session_tokens = {
        	    connect_token:d.AccessToken.ConnectToken, 
		    connect_secret: d.AccessToken.ConnectSecret,
		    api_base: d.AccessToken.APIBase,
		    rest_token:d.AccessToken.RESTToken, 
		    rest_secret: d.AccessToken.RESTSecret,
        	    oauth_cookie: d.AccessToken.OAuthCookie
		}; 
		
		dfd.resolve(activity);
	    })
	.error(function(data) {
	    // error handler
	    err = data;
	    alert("error fetching token xml " + data);
	});

    OpenAjax.hub.publish("request_visible_element",  $("#loading_div"));
    return dfd.promise();
};



var create_iframe = function(activity) {
    var interpolation_args = {
        'record_id' : RecordController.RECORD_ID,
        'account_id' : ACCOUNT_ID
    };
    
    startURL = interpolate_url_template(activity.resolved_activity.url, interpolation_args);
    RecordController.APP_ID = activity.resolved_activity.app;
    
    var frame_id = "app_content_iframe_"+randomUUID();

    $('#app_content_iframe_holder').html(
	'<iframe SEAMLESS src="'+startURL+
	    '" class="activity_iframe" id="'+frame_id+
	    '" width="100%" height="100%"> </iframe>');
    
    var frame = $("#"+frame_id);
    frame.data("loaded", false);

    var frame_load = function(){
	frame.data("loaded", true);
	$("#loading_div").hide();
    };
    
    frame.load(frame_load);

    setTimeout(function(){
	
	if (frame.data("loaded") === false){ 
	    $("#main_canvas").prepend("<div class='activity_iframe'><b>SMArt app loading error</b>.  Could not load: " + startURL+'</div>');
	}
    },10000);

    OpenAjax.hub.publish("request_visible_element",  $("#loading_div"));
    OpenAjax.hub.publish("request_grow_app", frame);    
    return frame[0];
};
