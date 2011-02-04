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
	
load: function(params) {      
    ACCOUNT = Account.from_email(ACCOUNT_ID); // init the account via model
    SMART = new SMART_CONTAINER(SMART_HELPER);

    RecordController = new smart_ui_server.Controllers.Record($("#app_content"));

    if (typeof(PROXIED_RECORD_ID) == "undefined") 
      PatientListController = new smart_ui_server.Controllers.PatientList($("#app_content"));
    
    PHAController = new smart_ui_server.Controllers.PHA($("#app_content"));
    	
    this.finish_initialization();
},

'request_visible_element subscribe': function(topic, element) {
    this.make_visible(element);
}, 

make_visible: function(element) {
    $(".activity_iframe:visible").hide();
    $("#app_content").hide();
    $("#app_content_iframe").hide();

    element.show();
    element.css("border", "0px");
},

finish_initialization: function(params) {
	OpenAjax.hub.publish("maincontroller.initialized");
	
  $(window).resize(function() {
	var w=$("html").width()-$('#app_selector').width();
	$("#main_canvas").css("width", w-20); 

  	var $elt =$("IFRAME.activity_iframe:visible");
	if ($elt.length == 0) return;

	$elt.hide();
  	var h=$(document).height()- $('#header').height();
	var minh = $elt.data("requested_height");
	h2 = Math.max(h, minh);
  	$elt.css("width", w-1).css("height", h2);  	
	$elt.show();
	console.log("held to minh: " + minh+","+h);
	
  });
  
  $(window).resize();  
  
}

});