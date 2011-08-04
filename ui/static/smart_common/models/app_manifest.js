/*
 * Activity model
 */

AppManifest = $.Model.extend('smart_common.Models.AppManifest',
/* @Static */
{ }, 

/* @Prototype */
{
    init: function(param) {	
	var act_url = '/indivoapi/apps/' + param.descriptor+'/manifest';
	$.ajax({
	    url: act_url,
	    dataType: "json"
	}).success(function(r) {
	    param.callback(r);
	});
	
    }
});

