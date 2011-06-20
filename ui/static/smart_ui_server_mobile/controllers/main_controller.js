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
    SMART = new SMART_CONTAINER(SMART_HELPER);

    RecordController = new smart_ui_server_mobile.Controllers.Record($("#content_app"));

    if (typeof(PROXIED_RECORD_ID) == "undefined") 
      PatientListController = new smart_ui_server_mobile.Controllers.PatientList($("#content_pt_selection"));
    
    PHAController = new smart_ui_server_mobile.Controllers.PHA($("#content_app_selection"));
    	
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

    /*    
    var cont = $("#app_content_iframe_holder");
    this.make_visible(cont);
    $("iframe", cont).hide();
    iframe.show();
    */
    var page = $(iframe).closest("[data-role='page']");
    if (page[0] !== jQuery.mobile.activePage[0])
	{
	    console.log("changing + growing app: ");
	    console.log(page);
	    $("div[data-role='header'] h1", page).text(PHAController.current_app.data.name);
	    $.mobile.changePage(page);
	    //	    this.grow_to_required_size();
	}
}, 
	

grow_to_required_size: function() {
    /*
    var iframe = $("iframe:visible");

    // 1. Figure out how much space there is on the screen
    var w = this.available_width;
    var h = this.available_height;
    
    if (window.orientation !== undefined)
    {
	w = screen.width;
	h = screen.height;
	var bigger = Math.max(w,h);
	var smaller = Math.min(w,h);

	switch(window.orientation) {
        case 0: // portrait
        case 180: // portrait
	    w = smaller;
	    h = bigger;
	    break;
	    
        case 90: // landscape
        case -90: // landscape
	    w = bigger;
	    h = smaller;
	    break;
	}
    }
    else 
	alert("no orientation");
    
    if (w !== iframe.data("old_w") || h !== iframe.data("old_h")) {
	console.log("growing app and div to total: " + w+","+h);
	console.log(window.orientation+" resizing outer iframe to: " + w+","+h);

	iframe.width(w).height(h).data("old_w", w).data("old_h", h);
	//	console.log(iframe);
    }
    */
},

finish_initialization: function(params) {
    var _this = this;
	OpenAjax.hub.publish("maincontroller.initialized");
	// TOOD: REfactor into height then width, so scrollbar logic can play out	
	/*
	$(window).resize(function() {
		var avail_w = $(window).width();
		var avail_h = $(window).height();
		$("[data-role='footer']:visible").text("size: " + avail_w+","+avail_h);

		console.log("width: "+avail_w);
		console.log("height: "+avail_h);

		_this.available_width = avail_w;
		_this.available_height = avail_h;
		    
		    // If there was an app open, let it know.
		    var iframe =$("IFRAME.activity_iframe:visible");
		    if (iframe.length > 0) {
			//			console.log("growing app for size " + avail_w+","+avail_h);
			_this.grow_to_required_size();
		    }
		});
	$(window).resize();  
	*/
}

});