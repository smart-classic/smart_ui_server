/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server.Controllers.Main',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{
	
 "{window} load": function(params) {
    ACCOUNT = Account.from_email(ACCOUNT_ID); // init the account via model
    SMART = new SMART_CONTAINER(SMART_HELPER);

    RecordController = new smart_common.Controllers.Record($("#app_content"));

    if (typeof(PROXIED_RECORD_ID) == "undefined") 
      PatientListController = new smart_common.Controllers.PatientList($("#app_content"));
    
    PHAController = new smart_common.Controllers.PHA($("#app_content"));
    AlertListController = new smart_common.Controllers.AlertList($("#app_content"));
    	
    this.finish_initialization();

},

'phas_loaded subscribe': function(topic) {
   if (typeof(INITIAL_APP) !== "undefined") {
	app = $.grep(PHAController.phas, function(pha) {return (pha.id === INITIAL_APP);})[0];

       $("#main_canvas").css({
	   "padding-left": "0",
	   "padding-top": "0",
	   "z-index":"10",
	   "background": "white"
       });

	PHAController.launch_app(app);

    }
}, 

'request_visible_element subscribe': function(topic, element) {
    this.make_visible(element);
}, 

make_visible: function(element) {
    $(".activity_iframe:visible").hide();
    $("#app_content").hide();
    $("#app_content_iframe_holder").hide();

    element.show();
    element.css("border", "0px");
},

'request_grow_app subscribe': function(topic, iframe) {
    var cont = $("#app_content_iframe_holder");
    this.make_visible(cont);
    $("iframe", cont).hide();
    iframe.show();
}, 
	


finish_initialization: function(params) {
    var _this = this;
	OpenAjax.hub.publish("maincontroller.initialized");
	// TOOD: REfactor into height then width, so scrollbar logic can play out		
}

});