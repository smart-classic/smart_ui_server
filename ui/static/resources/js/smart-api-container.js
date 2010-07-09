/*
 * The SMArt container side of the API
 *
 * Josh Mandel
 * Ben Adida
 */


// simple pattern to match URLs with http or https
var __SMART_URL_PATTERN = /^(https?:\/\/[^/]+)/;

// extract a postMessage appropriate origin from a URL
function __SMART_extract_origin(url) {
    var match = url.match(__SMART_URL_PATTERN);
    if (match)
	return match[1];
    else
	return null;
}

// very basic SMART API
SMART_CONTAINER = Class.extend({
    // the creds_and_info_generator is a func that will be called
    // prior to every "setup" message sent to the smart app.
    // it should generate a credential for that app and the current record, 
    // and should include basic information about the current record
    init: function(creds_and_info_generator) {
	this.creds_and_info_generator = creds_and_info_generator;

	this.apps_by_origin = {};
	this.frames_by_app = {};
	this.origins_by_app = {};
	this.tokens_by_app = {}
	
	// register the message receiver
	// wrap in a function because of "this" binding
	var _this = this;
	window.addEventListener("message", function(message) {
	    _this.receive_message(message);
	}, false);
    },

    // set up the IFRAME and the app that it corresponds to
    // the URL is used to determine the proper origin
    register_app: function(app_email, iframe, url) {
    	var origin = __SMART_extract_origin(url);
		this.apps_by_origin[origin] = app_email;
		this.frames_by_app[app_email] = iframe.contentWindow;
		this.origins_by_app[app_email] = origin;	
    },
    
    launch_app: function(app_email, account_id, record_id, callback) {
    	var account_id_enc = encodeURIComponent(account_id);
    	var record_id_enc = encodeURIComponent(record_id);
    	var app_email_enc = encodeURIComponent(app_email);
    	var _this = this;
    	
    	$.ajax({
			url: "/smart_api/accounts/"+account_id_enc+"/records/"+record_id_enc+"/apps/"+app_email_enc,
			data: null,
			type: "PUT",
			dataType: "text",
			success: 
			      function(data) {
    				// todo: we probably shouldn't rely on MVC in the smart-container. -JM
    				d  = MVC.Tree.parseXML(data);
    				
    				if (d.AccessToken.App["@id"] !== app_email)
    					throw "Got back access tokens for a different app! " + app_email +  " vs. " + d.AccessToken.App["@id"];
    					_this.tokens_by_app[app_email] = {token:d.AccessToken.Token, secret: d.AccessToken.Secret};
    					callback();
			      },
			error: function(data) {
			    	  // error handler
			    	  err = data;
			    	  alert("error fetching token xml " + data);
			      }
    	});    		
    },

    // process an incoming message
    receive_message: function(event) {
	// alert('received message from ' + event.origin + ', which is app ' + this.apps_by_origin[event.origin]);
	
	// determine origin, stop if unknown
	var app = this.apps_by_origin[event.origin];
	if (app == null)
	    return;
	
	// parse message
	var parsed_message = JSON.parse(event.data);

	// setup message with credentials and initial data
	if (parsed_message.type == 'ready') {
	    this.send_setup_message(app);
	}
	
	if (parsed_message.type == 'apicall') {
	    this.receive_apicall_message(app, parsed_message);
	}
    },

    receive_apicall_message: function(app, message) {

	var _this = this;

	$.ajax({
			url: "/smart_api/"+message.func,
			data: message.params,
			type: "GET",
			dataType: "text",
			success: 
			      function(data) {
		
				// no XHR passed to jquery 1.3 success callback (need 1.4 in JSMVC).
				  var ct = "xml"; //xhr.getResponseHeader("Content-Type"): "json";
				  
				  _this.send_app_message(app, {
					  'uuid' : message.uuid,
					  'type' : 'apireturn',
					  'content_type' : ct,
					  'payload' : data
					   });
			      },
			error: function(data) {
			    	  // error handler
			    	  alert("error");
			      }
	});
    },

    // message sent to the IFRAME when the "ready" message has been received
    send_setup_message: function(app) {
	var message = this.creds_and_info_generator(app);
	
	// add a type to the object to make it the full message
	message.type = 'setup';

	// send it
	this.send_app_message(app, message);
    },

    send_app_message: function(app, message) {
	// find the frame for this app, and send the json'ified message to it, specifying the proper origin
    	this.frames_by_app[app].postMessage(
    			JSON.stringify(message), 
    			this.origins_by_app[app]);
    }
});

