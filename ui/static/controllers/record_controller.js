//
// JMVC Controller for the Indivo Record
//

RecordController = MVC.Controller.extend('record', {
  // NOT called automatically on init! Called from main controller setup (workaround for IE issues
  // with include ordering -- ACCOUNT not being defined when this is called automatically)
  setup: function(params) {
    var _this = this;

    PHA.get_all(function(phas) {this.phas = phas;
	    jQuery.each(this.phas, function(i,v){
	        MainController.dispatch('_add_app', {'pha': v, 'fire_p': false})
	    });
    });

    
    ACCOUNT.get_recent_records(function(record_list) {
	    RecordController.set_recent_records(record_list);
	    });
    
    
    $('#current_patient').change(function() {
    	RecordController.RECORD_ID = $('SELECT#current_patient OPTION:selected').attr("value");
    	_this._load_record();
    	return false;
    });},
  
  // set_record_id: function(params) {
  //   RecordController.RECORD_ID = params.record_id;
  // },
   
  // set_app_id: function(params) {
  //   RecordController.APP_ID = params.app_id;
  // },

  _load_record: function() {
      var _this = this;
      var record_id = RecordController.RECORD_ID;
            
	  var exists = $('SELECT#current_patient OPTION[value=\''+record_id+'\']');
	  
	  // if the 'new' selection ain't new, we're done here.
	  if (	exists.attr("selected") &&  record_id == RecordController.CURRENT_RECORD.record_id ) {
		  return;
	  }
      
      
      Record.get(record_id, function(record) {
    	  _this.record = record;
    	  RecordController.CURRENT_RECORD = record;
    	  
    	  if (exists.length === 1)
    	  {
    		  // doesn't exist in jQuery 1.3 :-(  
    		  // exists.detach();
    		  //$('SELECT#current_patient').prepend(exists);
        	  exists.remove()
    	  }
		  exists = $("<option value='"+record.record_id+"'>"+record.label+"</option>");
		  $('SELECT#current_patient').prepend(exists);  
    	  
    	  $('SELECT#current_patient OPTION:selected').each(function() {$(this).removeAttr("selected");});
		  exists.attr('selected', 'selected');
    	  
          // If there was an app open on the old record, open it automatically on the new one.
          if (RecordController.APP_ID) {
        	  $('[href=\'#'+RecordController.APP_ID.replace(/@/, '_at_').replace(/\./g,'_')+'\']').click();
          }
      });
  },

});

RecordController.set_recent_records= function(rlist) {
    RecordController.recent_records_list = rlist;
    RecordController.RECENT_RECORDS = {};
    $(rlist).each(function(i, record) {
    RecordController.RECENT_RECORDS[record.id] = record;
    });
};