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
    $("#app_content_iframe_holder").hide();

    element.show();
    element.css("border", "0px");
},

'request_grow_app subscribe': function(topic, iframe) {
    var cont = $("#app_content_iframe_holder");
    this.make_visible(cont);
    $("iframe", cont).hide();
    iframe.show();

    this.grow_to_required_size();
}, 
	

grow_to_required_size: function() {
    var element = $("#app_content_iframe_holder");
    var iframe = $("iframe:visible", element);

    // 1. Figure out how much space there is on the screen
    var w = this.available_width;
    var h = this.available_height;
    
    if (w !== iframe.data("old_w") || h !== iframe.data("old_h")) {
	//	console.log("growing app and div to total: " + w+","+h);
	element.width(w).height(h);
	//	console.log(element);

	iframe.width(w).height(h).data("old_w", w).data("old_h", h);
	//	console.log(iframe);
    }
    
},

finish_initialization: function(params) {
    var _this = this;
	OpenAjax.hub.publish("maincontroller.initialized");
	// TOOD: REfactor into height then width, so scrollbar logic can play out	
	$(window).resize(function() {
		
		var avail_w = $(window).width() -  $("#main_canvas").get(0).offsetLeft -   $("#main_canvas").get(0).clientLeft;
		var avail_h = $(window).height() -  $("#main_canvas").get(0).offsetTop -   $("#main_canvas").get(0).clientTop;  
		_this.available_width = avail_w;
		_this.available_height = avail_h;
		if ($("#app_selector_inner").css("overflow-y")==="auto")
		    $("#app_selector").height(avail_h - 180);
		else
		    $("#app_selector").css("height", "");
		    // If there was an app open, let it know.
		    var iframe =$("IFRAME.activity_iframe:visible");
		    if (iframe.length > 0) {
			//			console.log("growing app for size " + avail_w+","+avail_h);
			_this.grow_to_required_size();
		    }
		});
	
	$(window).resize();  
	
}

});