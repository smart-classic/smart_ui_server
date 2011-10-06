/**
 * @tag controllers, home
 */
jQuery.Controller.extend('single_app_view.Controllers.Main',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{
	
 "{window} load": function(params) {

    ACCOUNT = new Account({email: ACCOUNT_ID,
			    account_id: ACCOUNT_ID});
     

    RecordController = new smart_common.Controllers.Record($("#app_content"));

      var proxied_record = new Record({
          record_id: PROXIED_RECORD_ID,
          label: PROXIED_RECORD_NAME,
          demographics: {}
      });


     RecordController.RECENT_RECORDS[PROXIED_RECORD_ID] = proxied_record;
     OpenAjax.hub.publish("patient_record.selected", PROXIED_RECORD_ID);	    
     OpenAjax.hub.publish("maincontroller.initialized");
     SMART.launch_app(MANIFEST, get_context(MANIFEST));

}


});