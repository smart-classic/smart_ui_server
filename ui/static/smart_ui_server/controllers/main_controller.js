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
    PatientSearchController = new smart_ui_server.Controllers.PatientSearch($("#app_content"));
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
	
  var scrollbarWidth = function() {
	var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
	// Append our div, do our calculation and then remove it
	$('body').append(div);
	var w1 = $('div', div).innerWidth();
	div.css('overflow-y', 'scroll');
	var w2 = $('div', div).innerWidth();
	$(div).remove();
	return (w1 - w2);
  }();
  
  $(window).resize(function() {
  	var $elt =$(".activity_iframe:visible");

  	
  	if ($elt.length == 0)
  		$elt = $("#app_content");

  	$(".activity_iframe").each(function(pos,f) {
	  			  f = $(f);
	  			  f.hide();
	  	    });
  	
  	$(".activity_iframe").each(function(pos, f) {
			  f = $(f);
	  			  f.css("height",$("#bigbody").height()- $("#footer").height()-$('#header').height());
	  			  f.css("width", $("#bigbody").width()-$('#app_selector').width());
	    });
	    
		    $("#app_content").css("height",$("#bigbody").height()- $("#footer").height()-$('#header').height());
	    $("#app_content").css("width", $("#bigbody").width()-$('#app_selector').width()); 

      $elt.show();    		
  });
  
  $(window).resize();  
  
}

});