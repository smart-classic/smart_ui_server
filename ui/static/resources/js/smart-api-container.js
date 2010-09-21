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
		this.activities = {};
		
		// register the message receiver
		// wrap in a function because of "this" binding
		var _this = this;
		window.addEventListener("message", function(message) {
		    _this.receive_message(message);
		}, false);
	    },
	    context_changed: function() {
	    	this.activities = {};
    },

    // process an incoming message
    receive_message: function(event) {
		
		// parse message
		var parsed_message = JSON.parse(event.data);

		// setup message with credentials and initial data
		if (parsed_message.type == 'ready') {
			var waiting_activity_ids = [];
			var ready_activity_ids = [];

			// a newly-launched activity is "ready" but doesn't yet know
			// its own activity_id. So, find the ID and inform the app.
			var _this = this;
			$.each(this.activities, function(one_aid, one_a) {
				if (one_a.ready === false && one_a.origin === event.origin)
					waiting_activity_ids.push(one_aid);
				else if (one_a.origin === event.origin)
					ready_activity_ids.push(one_aid);
			});
			
			// Preferably bind it to an ID that isn't yet claimed...
			// but if that fails, bind to any ID whose application matches
			var activity = waiting_activity_ids.length > 0 ? 
					this.activities[waiting_activity_ids[0]] :
					this.activities[ready_activity_ids[0]];
					
			activity.ready = true;
		    this.send_setup_message(activity, parsed_message);
		}
		
		var activity = this.activities[parsed_message.activity_id];
		if (parsed_message.type == 'apicall') {
		    this.receive_apicall_message(activity, parsed_message);
		}
				
		if (parsed_message.type == 'start_activity') {
		    this.receive_start_activity_message(activity, parsed_message);
		}
				
		if (parsed_message.type == 'end_activity') {
		    this.receive_end_activity_message(activity, parsed_message);
		}
    },

    foreground_activity: function(activity_id){
    	var activity = this.activities[activity_id];
		this.send_activity_message(
					 activity,
					  {
					  'type' : 'activityforeground'
					  });
    },

    background_activity: function(activity_id){
    	var activity = this.activities[activity_id];
		this.send_activity_message(
					activity,
					  {
					  'type' : 'activitybackground'
					  });
    },
    
    start_activity: function(activity_name, app){
    	var message = {
			   name: activity_name,
			   app: app
			   };
    	
    	this.receive_start_activity_message(null, message);
    },
    

    end_activity: function(activity_id){
    	var activity = this.activities[activity_id];
    	this.receive_end_activity_message(activity, {response: null});
    },

    receive_end_activity_message: function(activity, message) {
    	var callee = activity;
    	var caller = activity.caller;
    	var response = message.response;
    	var _this = this;
    	
    	if (caller === undefined) return;

		this.SMART_HELPER.handle_resume_activity(
			caller, 
			function() {
				  _this.send_activity_message(
							 caller,
							  {
							  'call_uuid' : callee.caller_message_id,
							  'type' : 'activityreturn',
							  'content_type' : "xml",
							  'payload' : response
							   });
				  });
    },
    receive_start_activity_message: function(activity, message) {
		var uuid = randomUUID();

    	var new_activity = this.activities[uuid]= {
    			uuid: uuid,
    			caller: activity,
				caller_message_id: message.call_uuid,
				name: message.name,
				app: message.app,
				ready_data: message.ready_data,
				ready: false
		};
    	
    	this.SMART_HELPER.handle_start_activity(
    		new_activity, 
			function(iframe) {
		    	var origin  = __SMART_extract_origin($(iframe).attr('src'));
		    	new_activity.origin = origin;
		    	new_activity.iframe = iframe;
			});
    },

    receive_apicall_message: function(activity, message) {
		var _this = this;
	
		var returnData = function(data) {
					  _this.send_activity_message(
						 activity,
						  {
						  'call_uuid' : message.call_uuid,
						  'type' : 'apireturn',
						  'content_type' : "xml",
						  'payload' : data
						   });}
		
		this.SMART_HELPER.handle_api(activity, message, returnData);
    },

    // message sent to the IFRAME when the "ready" message has been received
    send_setup_message: function(activity, incoming_message) {
		var _this = this;
		
    	var finishSetup = function(message) {
		    // add a type to the object to make it the full message
    	    message.type = 'setup';
			message.call_uuid = incoming_message.call_uuid;
    		message.ready_data = activity.ready_data;
		    // send it
		    _this.send_activity_message(activity, message);
	 	}

		this.SMART_HELPER.handle_record_info(activity.app, finishSetup);
    },

    send_activity_message: function(activity, message) {
	    message.activity_id = activity.uuid;
	    
    	activity.iframe.contentWindow.postMessage(
    			// find the frame for this app, and send the json'ified message
				// to it, specifying the proper origin
    			JSON.stringify(message), 
    			activity.origin);
    }
});

function randomUUID() {
	var s = [], itoh = '0123456789ABCDEF';
	// Make array of random hex digits. The UUID only has 32 digits in it, but
	// we
	// allocate an extra items to make room for the '-'s we'll be inserting.
	for ( var i = 0; i < 36; i++)
		s[i] = Math.floor(Math.random() * 0x10);
	// Conform to RFC-4122, section 4.4
	s[14] = 4; // Set 4 high bits of time_high field to version
	s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
	// Convert to hex chars
	for ( var i = 0; i < 36; i++)
		s[i] = itoh[s[i]];
	// Insert '-'s
	s[8] = s[13] = s[18] = s[23] = '-';
	return s.join('');
};