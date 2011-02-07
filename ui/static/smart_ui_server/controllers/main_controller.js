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
	// TOOD: REfactor into height then width, so scrollbar logic can play out	
	$(window).resize($.preserveScrollbars(function() {

		    var w = $("html").width() -  $("#main_canvas").get(0).offsetLeft -   $("#main_canvas").get(0).clientLeft;
		    
		    $("#main_canvas").hide(); 
		    var h=$(document).height()- $('#header').height();
		    $("#main_canvas").show();


		    // Main canvas now has width, height equal to available non-scrolling screen real estate.
 
		    var $elt =$("IFRAME.activity_iframe:visible");
		    if ($elt.length == 0) {
			$("#main_canvas").width(w); 
			$("#main_canvas").height(h);	      
			return;
		    }
	  
	  
		    var minSize = $.extend({width: 0, height: 0}, $elt.data("need_size"));
		    h2 = Math.max(h, minSize.height);
		    
		    if (h2 > $(document).height()) // there will be v-scrolling
			{
			    w -= $.getScrollbarWidth();
			}
		    
		    w2 = Math.max(w, minSize.width);
		    
		    if (w2 !== $elt.data("old_w") || h2 !== $elt.data("old_h")) {
			$("#main_canvas").width(w2).height(h2); 
			$elt.width(w2).height(h2).data("old_w", w2).data("old_h", h2);
		    }

		}));
	
	$(window).resize();  
	
}

});