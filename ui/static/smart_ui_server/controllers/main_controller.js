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
    $(window).resize();
},

finish_initialization: function(params) {
	OpenAjax.hub.publish("maincontroller.initialized");
	
  $(window).resize(function() {
	  
	  var w = $("html").width() -  $("#main_canvas").get(0).offsetLeft -   $("#main_canvas").get(0).clientLeft;
	  $("#main_canvas").width(w); 

	  var $elt =$("IFRAME.activity_iframe:visible");
	  if ($elt.length == 0) return;

	$elt.hide();
  	var h=$(document).height()- $('#header').height();
	
	var minSize = $.extend({width: 0, height: 0}, $elt.data("need_size"));
	h2 = Math.max(h, minSize.height);
	w2 = Math.max(w, minSize.width);
	$elt.width(w2).height(h2);
	$elt.show();
	
  });
  
  $(window).resize();  
  
}

});