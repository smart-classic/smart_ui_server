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
    },
  
  // set_record_id: function(params) {
  //   RecordController.RECORD_ID = params.record_id;
  // },
   
  // set_app_id: function(params) {
  //   RecordController.APP_ID = params.app_id;
  // },

  _load_record: function() {
      var _this = this;
      var record_id = RecordController.RECORD_ID;
            
      Record.get(record_id, function(record) {
    	  _this.record = record;
    	  RecordController.CURRENT_RECORD = record;
    	  $('#current_patient').html(record.label + " ("+record.record_id+")");
    	  
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