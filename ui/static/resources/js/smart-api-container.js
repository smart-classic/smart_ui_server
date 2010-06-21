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
    init: function() {
	this.apps_by_origin = {};
    },

    // set up the IFRAME and the app that it corresponds to
    // the URL is used to determine the proper origin
    register_app: function(app_email, iframe, url) {
	var origin = __SMART_extract_origin(url);
	this.apps_by_origin[origin] = app_email;
    },

    // process an incoming message
    receive_message: function(event) {
	alert('received message from ' + event.origin + ', which is app ' + this.apps_by_origin[event.origin]);
    },

    // message sent to the IFRAME when the "ready" message has been received
    send_setup_message: function() {
    }
});

SMART = new SMART_CONTAINER();
			     
window.addEventListener("message", SMART.receive_message, false);