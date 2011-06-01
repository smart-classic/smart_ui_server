/**
 * @tag controllers, home
 */
jQuery.Controller.extend('showcase.Controllers.Record',
/* @Static */
{

},
/* @Prototype */
{	
    	
   init: function(params) {
	this.RECENT_RECORDS = {};
	this.current_patient_label = $('#current_patient');
	this.current_patient_label.text("");
},
    
    'patient_record.selected subscribe': function(topic, record_id) {
    	this.RECORD_ID = record_id;		  
	    this._load_record();
	}, 

  after_record_obtained: function(record) {
	  RecordController.CURRENT_RECORD = record;
	  OpenAjax.hub.publish("pha.exit_app_context");
	  SMART.context_changed();

	  // If there was an app open on the old record, open it automatically
	  // on the new one.
	  if (RecordController.APP_ID) {
	      var app = $.grep(PHAController.phas, function(pha) {return (pha.id === RecordController.APP_ID);})[0];
	      OpenAjax.hub.publish("pha.launch", app);
	  } else if (RecordController.PAGE) {
	      RecordController.PAGE.index();
	  }

  },
  
  _load_record: function() {
      var record_id = this.RECORD_ID;
	  // if the 'new' selection ain't new, we're done here.
	  if ( this.CURRENT_RECORD && record_id == this.CURRENT_RECORD.record_id ) {
		  return;
	  }
	  
	  var already_obtained = RecordController.RECENT_RECORDS[record_id];
	  
	  if (already_obtained)
		  this.after_record_obtained(already_obtained);
      else
    	  Record.get(record_id,this.callback(after_record_obtained));
    },

'records.obtained subscribe': function(topic) {
    var options = "";
    var l = $("#patient-list");

    $.each(RecordController.records, function(k,v) {
	k = v.record_id;
	options += "<option value='"+k+"'>Patient: "+v.label+"</option>";
    });    

    l.html(options);

    l.change(function() {
	var r = RecordController.RECENT_RECORDS[l.val()];
	RecordController.after_record_obtained(r);
    });
}

 
});