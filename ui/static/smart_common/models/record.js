/*
 * the Record model
 */

Record= $.Model.extend('smart_common.Models.Record',
/* @Static */
{ 
    attributes : { 
	record_id : 'string'
    },
	search: function(search_params, callback) {
		var base_url = '/records/search/xml';
		$.getXML(base_url, search_params,  function(record_list) {

			var lst = record_list.Records.Record;
			
			if (lst === undefined) callback([]);
			
		    if (!(lst instanceof Array)) lst = [lst];
		    
		    var mapped_list = $.map(lst, function(el) 
		    		{return new Record(
		    				{record_id: el['@id'], 
		    					label: el['@label'], 
		    					demographics: el.demographics, 
		    					base_url: base_url});});		    
		    callback(mapped_list);
		});
		
	},
	
	get: function(record_id, callback) {
	    var base_url = '/records/' + encodeURIComponent(record_id);
	    $.getXML(base_url, function(result) {
			result = result.Records.Record;
			
	    	var r = new Record({
	    	record_id: record_id, 
	    	label: result['@label'], 
	    	demographics: result.demographics, 
	    	base_url: base_url});
		callback(r);
	    });
	}
	
},
/* @Prototype*/
{ 

});
