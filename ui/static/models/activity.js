/*
 * Account model
 */
 
Activity = Class.extend({
  init: function(name, app_id, callback) {	
    this.name= name;
    this.app = app_id;
    this.callback = callback;
    
    var self = this;
    
    var map_activity =  function(activity_info){
    	self.name = activity_info.Activity.name;
    	self.app =  activity_info.Activity.app;
    	self.url =  activity_info.Activity.url;
    	self.description = activity_info.Activity.description;
    	self.callback();
    };
    
    var act_url = '/activity/' + this.name+ (this.app !== null? '/app/'+this.app : "")
	$.getXML(act_url,map_activity);
  }
});
