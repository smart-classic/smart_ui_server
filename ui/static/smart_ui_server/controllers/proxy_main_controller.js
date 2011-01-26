/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server.Controllers.ProxyMain',
/* @Static */
{
	onDocument: true
 },
/* @Prototype */
{

'maincontroller.initialized subscribe': function(topic) {
    if (typeof(PROXIED_RECORD_ID) === "undefined")
	return;

      var proxied_record = new smart_ui_server.Models.Record({
          record_id: PROXIED_RECORD_ID,
          label: PROXIED_RECORD_NAME,
          demographics: {}
      });

      RecordController.RECENT_RECORDS[PROXIED_RECORD_ID] = proxied_record;
      OpenAjax.hub.publish("patient_record.selected", PROXIED_RECORD_ID);	    
  }
});