//
// JMVC Controller to display and manipulate apps associated with an account
// on the SMArt bootstrap.
// Josh Mandel (joshua.mandel@childrens.harvard.edu)
 

PHAController= MVC.Controller.extend('pha', {

setup: function(params){
    PHA.get_for_account(ACCOUNT_ID, function(phas) {
    	PHAController.enabled_phas = phas;
    	PHAController.dispatch("draw_phas");

    	var enabled_phas = phas;
        var enabled_pha_ids = $.map(enabled_phas, function(e){return e.id;})
        PHA.get_all(function(phas) {
        	
        	var disabled_phas = [];
        	
        	$.each(phas, function(i,pha) {
        		if ($.inArray(pha.id, enabled_pha_ids) == -1) {
        			disabled_phas.push(pha);
        		}
        	});

        	disabled_phas.sort(PHA.compare);

        	PHAController.phas = phas;
        	PHAController.enabled_phas = enabled_phas;
        	PHAController.disabled_phas = disabled_phas;
        });        
    });
},
	
 index: function(params) {
		RecordController.APP_ID = null;
		var _this = this;
		
    	this.render({to: 'app_content',
    				  using: {enabled_phas: PHAController.enabled_phas,
    						  disabled_phas: PHAController.disabled_phas}});
    	
        $('#app_content_iframe').hide();
        $('#app_content').show();

        $(".manage_apps BUTTON").click(function() {
        	var command = $(this).attr('id');
        	var app = null;
        	
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
        		PHAController.dispatch('index');
        		PHAController.dispatch('draw_phas');
        	});      
        });
},

_add_app: function(params) {
    // could use some refactoring, no?
    var pha = params.pha;
    var fire_p = params.fire_p;
    
    // add the tab, save the length-1 as index for removal closure
//    $('#app_selector').tabs('add', '#'+pha.safeid(), pha.data.name);
//    var len = $('#app_selector').tabs('length');
    
	     
	$('#app_selector_inner').append('<li><a href="#app/'+pha.safeid()+'">'+pha.data.name+'</a></li>');//('add', '#'+pha.safeid(), pha.data.name);
    // Create a <div> for each pha, with maybe an image
    var img_name =pha.safename();
    var line = '<img class="app_tab_img" src="/static/resources/images/app_icons_32/'+img_name+'.png" />';
  
    $('#app_selector_inner li:last').addClass('app');    
    if (!RecordController.CURRENT_RECORD)
        $('#app_selector_inner li:last').addClass('greyed_out');
    
    $('#app_selector_inner li:last').prepend(line);
    
},  
hash_change: function(event) {
	var app_id = event.value.match(/app\/(.*)/)[1];
	var app = $.grep(PHAController.phas, function(pha) {return (pha.safeid() === app_id);})[0];
	PHAController.dispatch('launch_app', app);
},
launch_app: function(pha) {
	 
    var interpolation_args = {
    		  'record_id' : RecordController.RECORD_ID,
    		  'account_id' : ACCOUNT_ID
    		  };

  	  startURL = interpolate_url_template(pha.data.startURLTemplate, interpolation_args);
  	  RecordController.APP_ID = pha.id;

  	  SMART.register_app(	pha.id, 
  			  				$('#app_content_iframe')[0],  
  			  				startURL);

  	  SMART_HELPER.launch_app(	
  			pha, 
  			ACCOUNT_ID, 
  			RecordController.CURRENT_RECORD.record_id,     			  			
  	  		function() {
  				// load and show the iframe
  				$('#app_content').hide();
  				$('#app_content_iframe').attr('src',  startURL);    		  
  			});	
},

draw_phas :function() {
	$('.app').remove();
    jQuery.each(PHAController.enabled_phas, function(i,v){
        PHAController.dispatch('_add_app', {'pha': v, 'fire_p': false})
    });
},

});
