/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server.Controllers.Record',
/* @Static */
{

},
/* @Prototype */
{	
    	
   init: function(params) {
	this.RECENT_RECORDS = {};
	
    var _this = this;
    
    Account.get_recent_records(ACCOUNT_ID, function(record_list) {
	    RecordController.set_recent_records(record_list);
	    });
    
    $('#current_patient').change(function() {
		$("LI.app").removeClass("greyed_out");
    	_this.RECORD_ID = $('SELECT#current_patient OPTION:selected').attr("value");
    	_this._load_record();
    	return false;
    });},
    
    
    'patient_record.selected subscribe': function(topic, record_id) {
    	this.RECORD_ID = record_id;		  
	    this._load_record();
	}, 

  _load_record: function() {
      var _this = this;
      var record_id = this.RECORD_ID;
            
	  var exists = $('SELECT#current_patient OPTION[value=\''+record_id+'\']');
	  
	  // if the 'new' selection ain't new, we're done here.
	  if (	exists.attr("selected") &&  record_id == this.CURRENT_RECORD.record_id ) {
		  return;
	  }

	  
	  var after_record_obtained = function(record) {
		  $("#header").flash( $("#header").css("color"), 500 );
    	  _this.record = record;
    	  RecordController.CURRENT_RECORD = record;
    	
    	  $("#select_patient_warning").html("&nbsp;patient: <strong>"+record.label+"</strong>");
      	
    	  if (exists.length === 1)
    	  {
    		  // detach doesn't exist in jQuery 1.3 :-(
    		  // exists.detach();
    		  // $('SELECT#current_patient').prepend(exists);
        	  exists.remove()
    	  }
		  exists = $("<option value='"+record.record_id+"'>"+record.label+"</option>");
		  $('SELECT#current_patient').prepend(exists);  
    	  
    	  $('SELECT#current_patient OPTION:selected').each(function() {$(this).removeAttr("selected");});
		  exists.attr('selected', 'selected');
	   
		  SMART.context_changed();
		  
          // If there was an app open on the old record, open it automatically
			// on the new one.
          if (RecordController.APP_ID) {
        		var app = $.grep(PHAController.phas, function(pha) {return (pha.id === RecordController.APP_ID);})[0];
            	OpenAjax.hub.publish("pha.launch", app);
          }
          $('#current_patient').change();
  
	  };
	  
	  var already_obtained = RecordController.RECENT_RECORDS[record_id];
	  if (already_obtained)
		  after_record_obtained(already_obtained);
      else
    	  Record.get(record_id,after_record_obtained);
  },
  
  set_recent_records:  function(rlist) {
	    RecordController.recent_records_list = rlist;
	    RecordController.RECENT_RECORDS = {};
	    $(rlist).each(function(i, record) {
	    RecordController.RECENT_RECORDS[record.record_id] = record;
	    });
  }	
});