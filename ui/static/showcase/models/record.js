/*
 * the Record model
 */

Record= $.Model.extend('showcase.Models.Record',
/* @Static */
{ 
    attributes : { 
	record_id : 'string'
    },
	search: function(sparql, callback) {
		var base_url = '/records/search/';
		$.getXML(base_url, sparql,  function(record_list) {

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
