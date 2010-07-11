/*
 * the Record model
 */

Record = Class.extend({

	init: function(record_id, label, demographics, base_url) {
		this.record_id = record_id;
		this.demographics = demographics;
		this.base_url = base_url;
		this.label = label;
    },

    // for SMArt
    add_app: function(app_email, callback) {
    	SMART.launch_app(app_email, callback);    	
    },
});

Record.search = function(sparql, callback) {
	var base_url = '/records/search/';
	$.getXML(base_url, sparql,  function(record_list) {
		var lst = record_list.Records.Record;
	    if (!(lst instanceof Array)) lst = [lst];
	    callback($(lst).map(function(el_num, el) {return  new Record(el['@id'], el['@label'], el.demographics, base_url);}));
	});
	
};

Record.get = function(record_id, callback) {
    var base_url = '/records/' + encodeURIComponent(record_id);

    $.getXML(base_url, function(result) {
    var r = new Record(record_id, result.Record['@label'], result.Record.demographics, base_url);
	callback(r);
    });
};