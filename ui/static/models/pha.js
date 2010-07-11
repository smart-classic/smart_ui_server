/*
 * the PHA model
 */

PHA = Class.extend({
  init: function(id, data) {
	  // set internal variables
  	this.id = id; this.data = data;
  	this.data.frameable = (this.data.frameable == "True");
  	this.data.ui = (this.data.ui == "True");
  },
  safeid: function() {
	  return this.id.replace(/@/, '_at_').replace(/\./g,'_');  
  },
  safename: function() {
	  return this.data.name.toLowerCase().replace(/ +/, '_');
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

PHA.get_for_account= function(account_email, callback) {
	$.getXML('/apps/accounts/'+account_email+'/', PHA.multi_callback(callback));
};

PHA.remove = function(account_email, app_id, callback) {
	PHA.manipulate("DELETE", account_email, app_id, callback);
};
PHA.add = function(account_email, app_id, callback) {
	PHA.manipulate("PUT", account_email, app_id, callback);
};
PHA.compare = function(a,b){
	if (a.id < b.id)
		return -1;
	else if (a.id===b.id)
		return 0;
	else
		return 1;
}

PHA.manipulate= function(method, account_email, app_email, callback) {
	var app_email_enc  = encodeURIComponent(app_email);
	var account_email_enc = encodeURIComponent(account_email);
	$.ajax({
  		url: "/smart_api/accounts/"+account_email_enc+"/apps/"+app_email_enc,
		data: null,
		type: method,
		dataType: "text",
		success: function(data) {
			callback();
	      }
	}); 
};

