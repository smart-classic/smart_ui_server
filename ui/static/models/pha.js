/*
 * the PHA model
 */

PHA = Class.extend({
  init: function(id, data) {
	  // set internal variables
  	this.id = id; this.data = data;
  	this.data.frameable = (this.data.frameable == "True");
  	this.data.ui = (this.data.ui == "True");
  }
});

PHA.single_callback = function(callback) {
  var ajax_callback = function(result) {
	  var pha = result.App;
  	callback(new PHA(pha['@id'], pha));
  };
  return ajax_callback;
};

PHA.multi_callback = function(callback) {
    ajax_callback = function(result) {
	var pha_list = result.Apps;
	
	if (pha_list == null) {
  	    callback([]);
  	    return;
	}

	var phas = pha_list.App;
	
	// for consistency
	if (!(phas instanceof Array))
  	    phas = [phas];
	
	var pha_objs = $(phas).map(function(i, pha) {
 	    return new PHA(pha['@id'], pha);
	});
	callback(pha_objs);
    };
    return ajax_callback;
};


PHA.get_all = function(callback) {
  $.getXML('/apps/', PHA.multi_callback(callback));
};

