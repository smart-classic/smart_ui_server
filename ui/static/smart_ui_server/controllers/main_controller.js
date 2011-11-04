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

    RecordController = new smart_common.Controllers.Record($("#app_content"));

    if (typeof(PROXIED_RECORD_ID) == "undefined") 
      PatientListController = new smart_common.Controllers.PatientList($("#app_content"));
    
    PHAController = new smart_common.Controllers.PHA($("#app_content"));
    AlertListController = new smart_common.Controllers.AlertList($("#app_content"));
    	
    this.finish_initialization();

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


    $(window).resize(function() {
	var avail_h = $(window).height() -  
	    $("#main_canvas").get(0).offsetTop -
	    $("#main_canvas").get(0).clientTop;  

	if ($("#app_selector_inner").css("overflow-y")==="auto")
	{
	    $("#app_selector").height(avail_h - 220);
	}
	
	else {
	    $("#app_selector").css("height", "");
	}

    });

    $(window).resize();


}

});