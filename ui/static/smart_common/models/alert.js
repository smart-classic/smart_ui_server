/*
 * Alert Model
 */

Alert = $.Model.extend('smart_common.Models.Alert',
/* @Static */
{ 

    get_all: function(record_id, callback) {
        $.getXML('/records/'+record_id+'/alerts/all', 
	     function(alert_list) {
		 try {
		     var lst = alert_list.Alerts.Alert;
		     if (!(lst instanceof Array)) lst = [lst];
		     
		 } catch (e) {return;}
		 callback($.map(lst, function(el) {
			     if (el === undefined) return null;
			     return new Alert(
                                  {alert_id: el['@id'], 
				   notes : el['notes'],
				   time: el['time'],
				   triggering_app: el['triggering_app'],
				   acknowledged_by: el['acknowledged_by'],
				   acknowledged_at: el['acknowledged_at']
				   });    	
		 }));
    });
    },
    acknowledge: function(email,alert_id, callback) {
        $.postXML('/accounts/' + email + '/alerts/'+alert_id+'/acknowledge', 
		 
	     function(alert_list) {
		     callback();
		 });
    }
}, 

/* @Prototype */
{

});

