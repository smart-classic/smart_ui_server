/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server_mobile.Controllers.Main',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{
	
"{window} load": function(params) {      
    ACCOUNT = Account.from_email(ACCOUNT_ID); // init the account via model

    RecordController = new smart_common.Controllers.Record($("#content_app"));

    if (typeof(PROXIED_RECORD_ID) == "undefined") 
      PatientListController = new smart_ui_server_mobile.Controllers.PatientList($("#content_pt_selection"));
    
    PHAController = new smart_ui_server_mobile.Controllers.PHA($("#content_app_selection"));
    	
    this.finish_initialization();
},

finish_initialization: function(params) {
    var _this = this;
    OpenAjax.hub.publish("maincontroller.initialized");
}

});