/**
 * @tag controllers, home
 */
jQuery.Controller.extend('showcase.Controllers.PHA',
/* @Static */
{
},
/* @Prototype */
{

'history.manage_apps_req.index subscribe': function(topic, data) {
    location.hash = "manage_apps";
    this.index();
}, 
    labels: {'enable': 'Add to dashboard', 'disable': 'Remove from dashboard'},
		
init: function(params){
	var _this = this;

    PHA.get_for_account(ACCOUNT_ID, function(phas) {
        var enabled_pha_ids = $.map(phas, function(e){return e.id;})
        
        PHA.get_all(function(phas) {
	    
        	$.each(phas, function(i,pha) {
        		if ($.inArray(pha.id, enabled_pha_ids) == -1) {
			    pha.enabled = false;
        		}
        		else {
			    pha.enabled = true;
        		}
        	});

	    phas.sort(PHA.compare);
        	_this.phas = phas;
        	_this.draw_phas();
        });        
    });
},

'patient_record.selected subscribe': function(topic, record_id) {
   $('#app_selector_inner li').removeClass('greyed_out');
}, 

"history.app_req.index subscribe" : function(called, data) {
	var app_id = data.id;
	location.hash = "app&id="+app_id;

	if (PHAController.phas && PHAController.phas.length > 0) {
	    var app = $.grep(PHAController.phas, function(pha) {return (pha.safeid() === app_id);})[0];
	    this.launch_app(app);
	}
},



'pha.launch subscribe': function(topic, app) {
    this.launch_app(app);
}, 

'pha.exit_app_context subscribe': function(topic, new_context) 
{
    if (new_context === undefined)
	new_context = "#patient_list_req";
    $("#app_selector li a").removeClass("selected_app");
    $("#app_selector li a[href='"+new_context+"']").addClass("selected_app");
},

'button.launch click': function(button) {
    var app = button.closest(".manage_apps").model();
    this.launch_app(app);
    $('.iframe_holder', this).html("");
    $('.iframe_holder', this).show();
},

launch_app: function(pha) {	 
	if (RecordController.RECORD_ID === undefined) {
		alert("Please choose a patient before running an app.");
	}


	$("#app_selector li a").removeClass("selected_app");
	$("#app_selector li a[href='#app_req&id="+pha.safeid()+"']").addClass("selected_app");
	
	var already_running = [];
	$.each(SMART.activities,
	       function(aid, a){if ( a.name=="main" && a.app == pha.id) already_running.push(a);});

	var about_to_background= [];
	$.each(SMART.activities,
	       function(aid, a){if ( a.app == RecordController.APP_ID) about_to_background.push(a);});

	if (about_to_background.length > 0) {
		SMART.background_activity(about_to_background[0].uuid);
	}
	
	if (already_running.length > 0) {
		SMART.foreground_activity(already_running[0].uuid);
		RecordController.APP_ID = already_running[0].resolved_activity.app;
		OpenAjax.hub.publish("request_grow_app", $(already_running[0].iframe));
		return;
	}
		
    SMART.start_activity("main", pha.id);
    OpenAjax.hub.publish("pha.launched", pha);
},

draw_phas :function() {
    this.element.html(this.view("index",
				{	
				    phas: this.phas,
				    message: this.labels
				}));
    
    $( "#app_accordion" ).accordion({collapsible: true, autoHeight: false}).accordion("activate", false);
    OpenAjax.hub.publish("request_visible_element", this.element);
}

});