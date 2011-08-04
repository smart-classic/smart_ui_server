/*
 * The SMART container side of the API
 * Josh Mandel
 * Ben Adida
 */

// simple pattern to match URLs with http or https
var __SMART_URL_PATTERN = /^(https?:\/\/[^/]+)/;

// extract a postMessage appropriate origin from a URL
function __SMART_extract_origin(url) {
    var match = url.match(__SMART_URL_PATTERN);
    if (match)
	return match[1].toLowerCase();
    else
	return null;
}

SMART_CONTAINER = function(SMART_HELPER) {

    this.debug = false;
    this.SMART_HELPER = SMART_HELPER;
    this.running_apps = {};
    this.running_apps.callbacks = {};
    var sc = this;

    var context = null;

    this.set_context = function(new_context) {
	context = new_context;

    	jQuery.each(this.running_apps, function(aid, a){
    	    var c = a.channel;
    	    if (c)  {
        	c.call({method: "app_instancedestroy", success: function(){}});
    		c.destroy();
    	    }
    	});
	
	this.running_apps = {};	    


	SMART_HELPER.handle_context_changed(new_context);
    };

    this.get_context = function() {
	return context;
    }

    var procureChannel = function(event){
	var app_instance = null;
	if (event.data !== "procure_channel") return;

	$.each(sc.running_apps, function(aid, a) {
	    if (a.iframe && a.iframe.contentWindow === event.source)
		app_instance = a;
	});
	
	if (app_instance) { // TODO:  replace contents with sc.bindChannel();
	    app_instance.channel && app_instance.channel.destroy();
	    
	    app_instance.channel  = Channel.build(
	        {window: app_instance.iframe.contentWindow, 
	         origin: app_instance.origin, 
	         scope: app_instance.uuid, 
	         debugOutput: sc.debug});
	    
	    app_instance.channel.bind("api_call", function(t, p) {
		t.delayReturn(true);
		sc.receive_api_call(app_instance, p, t.complete); // TODO pass app instance by uuid
	    });

	    app_instance.channel.bind("ready", function(t, p) {
		t.delayReturn(true);
		sc.receive_ready(app_instance.uuid, t.complete);
	    });

	    app_instance.channel.bind("adjust_size", function(t, p) {
		sc.SMART_HELPER.handle_adjust_size(app_instance, p);
  	    });

	    app_instance.channel.bind("start_app_instance", function(t, p) {
		t.delayReturn(true);
		sc.receive_start_app_instance_message(app_instance, p, t.complete);
	    });

	    app_instance.channel.bind("end_app_instance", function(t, p) {
		t.delayReturn(true);
		sc.receive_end_app_instance_message(app_instance,p);
	    });

	    app_instance.channel.bind("restart_app_instance", function(t, p) {
		t.delayReturn(true);
		sc.receive_restart_app_instance_message(app_instance,t.complete);
	    });

	    event.source.postMessage("app_instance_uuid="+app_instance.uuid, app_instance.origin);
	}
    };

    if (window.addEventListener) window.addEventListener('message', procureChannel, false);
    else if(window.attachEvent) window.attachEvent('onmessage', procureChannel);

    this.receive_api_call = function(app_instance_uuid, message, callback) {
	/* //TODO:  uncomment this after passing context with every call

	var call_context = message.context;

	if (typeof call_context.user !== typeof context.user)
	    throw "User context doesn't match API call context";

	if (call_context.user && (call_context.user.id !== context.user.id))
	    throw "User context doesn't match API call context";

	if (typeof call_context.record !== typeof context.record)
	    throw "Record context doesn't match API call context";

	if (call_context.record && (call_context.record.id !== context.record.id))
	    throw "Record context doesn't match API call context";

	var call_params = message.call_params;
	*/
	this.SMART_HELPER.handle_api(app_instance_uuid, 
				     message, 
				     function(r){callback({contentType: "xml",  data: r})});	    
    };

    this.receive_ready = function(app_instance_uuid, callback) {	    
	var _this = this;
	var app_instance = this.running_apps[app_instance_uuid];
	var message = app_instance.context;	// TODO:  clean this structure.
	message.app_instance_id = app_instance_uuid;
	message.ready_data = app_instance.ready_data;

	callback(message);
    };

/*
    this.foreground_app_instance= function(app_instance_id){
    	var app_instance = this.running_apps[app_instance_id];
	if (app_instance.channel !== undefined)
	    app_instance.channel.call({method: "app_instanceforeground", success: function(){}});
    };

    this.background_app_instance = function(app_instance_id){
    	var app_instance = this.running_apps[app_instance_id];
	if (app_instance.channel !== undefined)
	    app_instance.channel.call({method: "app_instancebackground", success: function(){}});
    };
  */
  
    this.launch_app = function(activity_name, app_id){
    	var app_description = {
	    name: activity_name,
	    app: app_id
	};
    	
    	this.receive_launch_app(null, app_description);
    };
    
/*
    end_app_instance: function(app_instance_id){
    	var app_instance = this.running_apps[app_instance_id];
    	this.receive_end_app_instance_message(app_instance, {response: null});
    },

    receive_restart_app_instance_message: function(app_instance, callback) {
	var _this = this;

    	callback(true);
    	app_instance.channel.destroy();
	
    	this.clear_unbound_channels();
    	
	
    },

    
    receive_end_app_instance_message: function(app_instance, message) {
    	var caller = app_instance.caller;
    	var response = message.response;    	
	
    	if (caller === undefined) return;

    	this.SMART_HELPER.handle_resume_app_instance(
						 caller, 
						 function() {
							 caller.callbacks[app_instance.uuid]({contentType: "xml", data: response});
						 });
    },
*/
     this.receive_launch_app = function(launched_by, app_description, input_data, callback) {
    	var uuid = randomUUID();
    	if (launched_by !== null) {
    		running_apps.callbacks[uuid] = callback;
    	}

    	
    	var new_app_instance = this.running_apps[uuid]= {
    	    uuid: uuid,
    	    caller: launched_by,
	    name: app_description.name, //TODO:  call these activity_name and app_id
	    app: app_description.app,
	    ready_data: input_data,
	    ready: false
	};
    	
	this.SMART_HELPER.handle_start_activity(
	    new_app_instance, 
	    function(iframe) {
		var origin  = __SMART_extract_origin(jQuery(iframe).attr('src'));
		new_app_instance.origin = origin;
		new_app_instance.iframe = iframe;
		
    		sc.clear_unbound_channels();
		
		// Make sure we've received context var before letting the app call "ready" 
		// to avoid a race condition.  (We could, alternatively, poll on  context 
		// when "ready" is called.)
		sc.SMART_HELPER.handle_record_info(new_app_instance, function(context) {
		    new_app_instance.context = context;
		    sc.receive_ready(new_app_instance.uuid)
		});
	    });
     };
    
    this.clear_unbound_channels = function() {
	    jQuery.each(this.running_apps, function(aid, app_instance) {
	    	if (app_instance.ready === false && app_instance.channel !== undefined)
	    	{	
	    		app_instance.channel.destroy();
	    		app_instance.channel = undefined;
	    	}
	    });
    };

};

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