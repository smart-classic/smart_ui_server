/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server.Controllers.PHA',
/* @Static */
{

},
/* @Prototype */
{

'history.manage_apps_req.index subscribe': function(topic, data) {
    location.hash = "manage_apps";
    this.index();
}, 

		
init: function(params){
	var _this = this;

    PHA.get_for_account(ACCOUNT_ID, function(phas) {
        var enabled_pha_ids = $.map(phas, function(e){return e.id;})
        
        PHA.get_all(function(phas) {
        	var enabled_phas = [] ;        	
        	var disabled_phas = [];
        	
        	$.each(phas, function(i,pha) {
        		if ($.inArray(pha.id, enabled_pha_ids) == -1) {
        			disabled_phas.push(pha);
        		}
        		else {
        			enabled_phas.push(pha);
        		}
        	});

        	enabled_phas.sort(PHA.compare);
        	disabled_phas.sort(PHA.compare);
        	_this.phas = phas;
        	_this.enabled_phas = enabled_phas;
        	_this.disabled_phas = disabled_phas;    	
        	_this.draw_phas();
	        OpenAjax.hub.publish("phas_loaded");

        });        
    });
},
	
 index: function(params) {
		RecordController.APP_ID = null;
		var _this = this;

		this.element.html(this.view("index",
		{	
					enabled_phas: PHAController.enabled_phas,
					disabled_phas: PHAController.disabled_phas
		}));

		OpenAjax.hub.publish("request_visible_element", $('#app_content'));
		OpenAjax.hub.publish("pha.exit_app_context", "#manage_apps_req");

    	var _this = this;
        $(".manage_apps BUTTON").click(function() {
        	var command = $(this).attr('id');
        	var app = null;
        	
		$(this).attr("disabled", "true");
		$(this).text("Loading...");

        	if (command.indexOf("remove_app_") >-1) {
        		app = command.split("remove_app_")[1];
        		command = "DELETE";
        		var x = "disabled_phas";
        		var y = "enabled_phas";
        	}
        	else if (command.indexOf("add_app_")>-1) {
        		app = command.split("add_app_")[1];
        		command = "PUT";
        		var y = "disabled_phas";
        		var x = "enabled_phas";
        	}
        	else {
        		throw "Expecting add or remove command, got " + command;
        	}
        	
        	app = $.grep(PHAController.phas, function(pha) {return (pha.safeid() === app);})[0];
        	
        	PHAController[y] = $.grep(PHAController[y], function(pha) {return (pha.id !== app.id)});
        	PHAController[x].push(app); 
        	PHAController[x].sort(PHA.compare);
        	
        	PHA.manipulate(command, ACCOUNT_ID, app.id, function() 
        	{
        		_this.index();
        		_this.draw_phas();
        	});      
        });
},
'patient_record.selected subscribe': function(topic, record_id) {
   $('#app_selector_inner li').removeClass('greyed_out');
}, 

_add_app: function(params) {
    var pha = params.pha;
    	     
	$('#app_selector_inner').append('<li><a href="#app_req&id='+pha.safeid()+'">'+pha.data.name+'</a></li>');//('add', '#'+pha.safeid(), pha.data.name);
    var line = '<img class="app_tab_img" src="'+pha.data.iconURL+'" />';
  
    $('#app_selector_inner li:last').addClass('app');    
    if (!RecordController.CURRENT_RECORD)
        $('#app_selector_inner li:last').addClass('greyed_out');
    
    $('#app_selector_inner li:last A').prepend(line);
    
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
},

draw_phas :function() {
	$('.app').remove();
	var _this = this;
    jQuery.each(PHAController.enabled_phas, function(i,v){
    	_this._add_app({'pha': v});
    });
}

});