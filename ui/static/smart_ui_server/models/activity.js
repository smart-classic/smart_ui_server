/*
 * Activity model
 */

Activity = $.Model.extend('smart_ui_server.Models.Activity',
/* @Static */
{ }, 

/* @Prototype */
{

	init: function(params) {	
		    
	    var self = this;
	    
	    var map_activity =  function(activity_info){
	    	self.name = activity_info.Activity.name;
	    	self.app =  activity_info.Activity.app;
	    	self.url =  activity_info.Activity.url;
	    	self.description = activity_info.Activity.description;
	    	self.consumer_key = activity_info.Activity.consumer_key;
	    	self.secret= activity_info.Activity.secret;
	    	self.callback(self);
	    };
	    
	    var act_url = '/activity/' + this.name+ (this.app_id !== null? '/app/'+this.app_id : "")
		$.getXML(act_url,map_activity);
	}
}
);

