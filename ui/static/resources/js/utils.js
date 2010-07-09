/*
 * Some utilities for JMVC implementation
 * Ben Adida
 * ben@adida.net
 */

// fixme: probably move this after move to JMVC 2.0
// a hack for the new api now
jQuery.getXML = function(url,data, callback) {
	if (arguments.length == 2)
	{
		callback = data;
		data = null;
	}
	
	url = '/indivoapi'+url;
    
    jQuery.get(url, data, function(data) {
      callback(MVC.Tree.parseXML(data));
    }, "text");
};


// the new way to do an Indivo API call with jQuery XML parsing
indivo_api_call = function(method, url, data, callback, error_callback) {
    url = '/indivoapi' + url;
    $.ajax({
	type: method,
	url: url,
	data: data,
	dataType: "xml",
	success: callback,
	error: error_callback
    });
};


// interpolate a URL template
// based on mnot's idea, simplified here for explicit use and vars
function interpolate_url_template(url_template, vars) {
	
	// allow for late binding of variables, e.g. to resolve a 
	// record ID that can't be known at time of app creation.
	if (typeof(vars) === 'function')
	{
		vars = vars();
	}
	
    var result = url_template;
    $.each(vars, function(var_name, var_value) {
      var regexp = new RegExp("{" + var_name + "}");
      result = result.replace(regexp, var_value);
    });
    return result;
}

function when_ready(ready_function, callback) {
    setTimeout(function() {
	if (ready_function())
	    callback();	
    }, 1000);
};