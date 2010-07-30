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
    init: function(SMART_HELPER) {
	this.SMART_HELPER = SMART_HELPER;
	this.apps_by_origin = {};
	this.frames_by_app = {};
	this.origins_by_app = {};
	this.tokens_by_app = {}
	this.cached_results = {};	
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

	var returnData = function(data) {
				  _this.send_app_message(app, {
					  'uuid' : message.uuid,
					  'type' : 'apireturn',
					  'content_type' : "xml",
					  'payload' : data
					   });}

	this.SMART_HELPER.api(app, message, returnData);
    },


    // message sent to the IFRAME when the "ready" message has been received
    send_setup_message: function(app) {
	var message = this.SMART_HELPER.creds_and_info_generator(app);
	
	// add a type to the object to make it the full message
	message.type = 'setup';

	// send it
	this.send_app_message(app, message);
    },

    send_app_message: function(app, message) {
    	this.frames_by_app[app].postMessage(
    			// find the frame for this app, and send the json'ified message to it, specifying the proper origin
    			JSON.stringify(message), 
    			this.origins_by_app[app]);
    }
});

