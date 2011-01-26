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
    //    PatientListController = new smart_ui_server.Controllers.PatientList($("#app_content"));
    PHAController = new smart_ui_server.Controllers.PHA($("#app_content"));
    	
    this.finish_initialization();
},

'request_visible_element subscribe': function(topic, element) {
    this.make_visible(element);
}, 

make_visible: function(element) {
	$(".activity_iframe:visible").each(function(pos, f) {
			  f = $(f);
			  f.hide();
		  }
	    );
		
	    $("#app_content").hide();
	    $("#app_content_iframe").hide();

	    element.show();
	    element.css("border", "0px");

		$(window).resize();
},

finish_initialization: function(params) {
	OpenAjax.hub.publish("maincontroller.initialized");
	
  $(window).resize(function() {
  	var $elt =$(".activity_iframe:visible");
  	if ($elt.length == 0)
  		$elt = $("#app_content");

  	$(".activity_iframe").each(function(pos,f) {
	  			  f = $(f);
	  			  f.hide();
	  	    });
  	
  	var h=$("#bigbody").height()- $('#header').height(),
  	    w=$("#bigbody").width()-$('#app_selector').width();
  	
  	$(".activity_iframe").each(function(pos, f) {
			  f = $(f);
	  			  f.css("height", h);
	  			  f.css("width", w);
	    });
	    
	    $("#app_content").css("height",h);
	    $("#app_content").css("width", w); 
	    $("#main_canvas").css("height", h); 
	    $("#main_canvas").css("width", w); 

      $elt.show();    		
  });
  
  $(window).resize();  
  
}

});