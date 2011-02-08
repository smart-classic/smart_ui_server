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

    this.grow_to_required_size(cont);
}, 
	

grow_to_required_size: function(element) {
    var element = $("#app_content_iframe_holder");
    var iframe = $("iframe:visible", element);

    // 1. Figure out how much space there is on the screen
    var w = this.available_width;
    var h = this.available_height;
    
    // 2. Figure out if our element has any miniumum requirements
    var minSize = $.extend({width: 0, height: 0}, iframe.data("need_size"));

    // 3. Compute our element's size based on requirements + available space
    h2 = Math.max(h, minSize.height);

    if (h2 > this.available_height) // there will be v-scrolling
	{
	    w -= $.getScrollbarWidth();
	}
    w2 = Math.max(w, minSize.width);

    
    if (w2 !== iframe.data("old_w") || h2 !== iframe.data("old_h")) {
	console.log("growing app and div to total: " + w2+","+h2);
	element.width(w2).height(h2);
	console.log(element);

	iframe.width(w2).height(h2).data("old_w", w2).data("old_h", h2);
	console.log(iframe);
    }
    
},

finish_initialization: function(params) {
    var _this = this;
	OpenAjax.hub.publish("maincontroller.initialized");
	// TOOD: REfactor into height then width, so scrollbar logic can play out	
	$(window).resize($.preserveScrollbars(function() {
		    
		    var avail_w = $("html").width() -  $("#main_canvas").get(0).offsetLeft -   $("#main_canvas").get(0).clientLeft;		    
		    
		    $("#main_canvas").hide(); 
		    var avail_h=$(document).height()- $('#header').height();
		    $("#main_canvas").show();
		    
		    _this.available_width = avail_w;
		    _this.available_height = avail_h;

		    
		    // If there was an app open, let it know.
		    var iframe =$("IFRAME.activity_iframe:visible");
		    if (iframe.length > 0) {
			console.log("growing app for size " + avail_w+","+avail_h);
			_this.grow_to_required_size();

		    }
		}));
	
	$(window).resize();  
	
}

});