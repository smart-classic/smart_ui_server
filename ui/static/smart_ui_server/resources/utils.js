/*
 * Some utilities for JMVC implementation
 * Ben Adida
 * ben@adida.net
 */

// fixme: probably move this after move to JMVC 2.0
// a hack for the new api now

var xotree = new XML.ObjTree();
xotree.attr_prefix = '@';

jQuery.getXML = function(url,data, callback) {
	if (arguments.length == 2)
	{
		callback = data;
		data = null;
	}
	
	url = '/indivoapi'+url;

    jQuery.get(url, data, function(data) {
      callback(xotree.parseXML(data));
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

jQuery.fn.flash = function( color, duration )
{
    try {
	var current = this.css("background-color");
	this.stop().animate({ backgroundColor: color}, duration/3, 'swing', function() {
		$(this).animate({ backgroundColor: current}, 2*duration/3);
		
	});
    } catch(e) {
	this.css("background-color", current);
    }
};

(function($) {
    var scrollbarWidth = 0;
    $.getScrollbarWidth = function() {
	if ( !scrollbarWidth ) {
	    if ( $.browser.msie ) {
		var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
		.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body'),
		$textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
		.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body');
		scrollbarWidth = $textarea1.width() - $textarea2.width();
		$textarea1.add($textarea2).remove();
	    } else {
		var $div = $('<div />')
		.css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
		.prependTo('body').append('<div />').find('div')
		.css({ width: '100%', height: 200 });
		scrollbarWidth = 100 - $div.width();
		$div.parent().remove();
	    }
	}
	return scrollbarWidth;
    };
})(jQuery);

(function($){
    $.preserveScrollbars = function(fn) {

	return function() {
	    var scrollPos = {
		left: $(window).scrollLeft(),
		top: $(window).scrollTop()
	    };
	    
	    fn.apply(this, arguments);

	    $(window).scrollLeft(scrollPos.left);
	    $(window).scrollTop(scrollPos.top);
	}

	
	  

    };
})(jQuery);
