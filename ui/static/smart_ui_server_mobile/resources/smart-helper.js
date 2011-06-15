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
	},
        'browser_environment': 'mobile'
	});
};

SMART_HELPER.handle_resume_activity = function(activity, callback) {
	OpenAjax.hub.publish("request_visible_element",  $(activity.iframe));
	callback();
};

var create_iframe = function(activity) {
    var interpolation_args = {
        'record_id' : RecordController.RECORD_ID,
        'account_id' : ACCOUNT_ID
    };
    
    startURL = interpolate_url_template(activity.resolved_activity.url, interpolation_args);
    RecordController.APP_ID = activity.resolved_activity.app;
    
    var frame_id = "app_content_iframe_"+randomUUID();

    $('#content_app').html(
	'<iframe SEAMLESS src="'+startURL+
	    '" class="activity_iframe" id="'+frame_id+
	    '" width="100%" height="100%"> </iframe>');
    
    var frame = $("#"+frame_id);
    
    var frame_load = function(){
	frame.data("loaded", true);
    };
    
    frame.load(frame_load);
    setTimeout(function(){
	if (frame.data("loaded") !== true){ 
	    frame_load();
	    $("#main_canvas").prepend("<div class='activity_iframe'><b>SMArt app loading error</b>.  Could not load: " + startURL+'</div>');
	}
    },10000);

    OpenAjax.hub.publish("request_grow_app", frame);    
    return frame[0];
};
