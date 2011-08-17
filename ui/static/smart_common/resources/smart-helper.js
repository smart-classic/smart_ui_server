SMART = new SMART_CONNECT_HOST();

SMART.handle_context_changed = function(){};

SMART.on_app_launch_complete = function(app_instance) {
    if (app_instance.manifest.scope=="record")
	RecordController.APP_ID = app_instance.manifest.id;
};

SMART.get_credentials = function (app_instance, callback){

    var app_email_enc = encodeURIComponent(app_instance.manifest.id);
    var account_id_enc = encodeURIComponent(app_instance.context.user.id);

    var record_data = null;
    if (app_instance.manifest.scope=="record")
	record_data = {'record_id': encodeURIComponent(app_instance.context.record.id)};


    $.ajax({
        url: "/accounts/"+account_id_enc+"/apps/"+app_email_enc+"/launch",
    	data: record_data,
    	type: "GET",
    	dataType: "text"})
    	.success(
    	    function(data) {
		d  = xotree.parseXML(data);    		   

		if (d.AccessToken.App["@id"] !== app_instance.manifest.id)
        	    throw "Got back access tokens for a different app! " + 
		    app_instance.manifest.id.app +  
		    " vs. " + 
		    d.AccessToken.App["@id"];
		
		var credentials = {
        	    connect_token:d.AccessToken.ConnectToken, 
        	    connect_secret:d.AccessToken.ConnectSecret, 
		    api_base: d.AccessToken.APIBase,
		    rest_token:d.AccessToken.RESTToken, 
		    rest_secret: d.AccessToken.RESTSecret,
        	    oauth_header: d.AccessToken.OAuthHeader
		}; 
		
		callback(credentials);
	    })
	.error(function(data) {
	    // error handler
	    err = data;
	    alert("error fetching token xml " + data);
	});
};

SMART.get_iframe = function (app_instance, callback){
    var frame_id = "app_content_iframe_"+app_instance.uuid;

    $('#app_content_iframe_holder').append(
	'<iframe SEAMLESS src="about:blank"'+
	    '" class="activity_iframe" id="'+frame_id+
	    '" width="100%" height="100%"> </iframe>');
    
    var frame = $("#"+frame_id);
    OpenAjax.hub.publish("request_grow_app", frame);    
    callback(frame[0]);
};

var get_context = function(manifest) {
    var ret = {'browser_environment': 'desktop'};

    ret.user=  {
    	    'id': ACCOUNT_ID,
    	    'full_name': FULLNAME
    };

    if (RecordController.CURRENT_RECORD)
     	ret.record= {
    	    'full_name' : RecordController.CURRENT_RECORD.label,
    	    'id' : RecordController.CURRENT_RECORD.record_id
	};

    return ret;
};

// calls back wtih the response to an API call.  
// (implemented as passthrough to a back-end REST server)
SMART.handle_api = function(app_instance, message, callback) {
    var params = {
	'smart_connect_token': app_instance.credentials.connect_token,
	'smart_connect_secret': app_instance.credentials.connect_secret
    };
	
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
	    alert("error handling API");
	    console.log(app_instance);
	    console.log(message);
	    console.log(data);
	}
    });
};
