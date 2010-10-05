function OAuthServiceSmart(options) {
    var parent = OAuthServiceSmart.prototype;
	
	var _private = {
		debug: false
	};
    
    this.signature_method = 'HMAC-SHA1';

    this.smart_server = 'http://localhost:7000/oauth/';
    this.smart_ui_server = 'http://localhost:7001/oauth/';
    this.requestTokenUrl = this.smart_server + 'request_token';
    this.authorizationUrl = this.smart_ui_server + 'authorize';
    this.accessTokenUrl = this.smart_server + 'access_token';
    this.authenticationUrl = null;
    this.onInitialized = function(){};
   
    this.init = function(options) {
	_private.debug = 'debug' in options ? options.debug : _private.debug;
        parent.init.apply(this, arguments);
    };
	    
    if (arguments.length > 0) {
        this.init(options);
    };
}

OAuthServiceSmart.prototype = new OAuthService();