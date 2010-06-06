/*
 * the Record model
 */

Record = Class.extend({
    init: function(record_id, label, demographics, base_url, carenet) {
	this.record_id = record_id;
	this.demographics = demographics;
	this.base_url = base_url;
	this.label = label;
    },
    
    get_document_list: function(tags, callback) {
	$.getXML(this.base_url + '/documents/', function(doc_list) {
	    callback(doc_list);
	});
    },
    
    get_carenets: function(document_id, callback) {
	var url = '/carenets/';
	if (document_id != null)
	    url = '/documents/' + document_id + '/carenets/';
	
	var _this = this;
	indivo_api_call("GET", this.base_url + url, null, function(result) {
	    var carenets_xml = $(result).find('Carenets').find('Carenet');
	    var carenets = [];
	    callback(carenets_xml.map(function(i, carenet_xml_node) {
		return Carenet.from_xml_node(_this.record_id, carenet_xml_node);
	    }));
	});
    },
});

// aks: why the syntax differnce in method adding? 
Record.get = function(record_id, carenet_id, callback) {
    var base_url = '/records/' + encodeURIComponent(record_id);

    // with a carenet, replace the base URL
    if (carenet_id) {
	base_url = "/carenets/" + carenet_id;
	return callback(new Record(record_id, 'No Label', null, carenet_id, base_url));
    }

    $.getXML(base_url, function(result) {
	var r = new Record(record_id, result.Record['@label'], result.Record.demographics, base_url, carenet_id);
	callback(r);
    });
};