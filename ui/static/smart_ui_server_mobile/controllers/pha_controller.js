/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server_mobile.Controllers.PHA',
/* @Static */
{

},
/* @Prototype */
{

'history.page_app_selection.index subscribe': function(topic, data) {
    SMART.record_context_changed();
    RecordController.APP_ID = null;
    console.log("On the app selection apge");
    this.selection();
}, 

'history.page_app_management.index subscribe': function(topic, data) {
    this.manage();
}, 

		
init: function(params){
	var _this = this;

    PHA.get_for_account(ACCOUNT_ID, function(phas) {
	    var enabled_pha_ids = $.map(phas, function(e){
		    if (e.data.supportedBrowserEnvironments.match("mobile")) {
                      return e.id; 
		    }
		    return null;
		});
        
        PHA.get_all(function(phas) {
        	var enabled_phas = [] ;        	
        	var disabled_phas = [];
        	
		phas = $.grep(phas, function(e) {
			return e.data.supportedBrowserEnvironments.match("mobile");
		    });

        	phas.sort(PHA.compare);
        	$.each(phas, function(i,pha) {
        		if ($.inArray(pha.id, enabled_pha_ids) == -1) {
        			disabled_phas.push(pha);
        		}
        		else {
        			enabled_phas.push(pha);
        		}
        	});

        	_this.phas = phas;
        	_this.enabled_phas = enabled_phas;
        	_this.disabled_phas = disabled_phas;    	
		console.log("estgablished phas");
        });        
    });
},
	
selection: function(params){
    var page =     $("#page_app_selection");
    var content =     $("div[data-role='content']", page);
    content.html(this.view("list", {phas: this.enabled_phas}));
    page.page("destroy").page();
},
	
 manage: function(params) {
    RecordController.APP_ID = null;
    var _this = this;
    
    var page =     $("#page_app_management");
    var content =     $("div[data-role='content']", page);
    content.html(this.view("list", {phas: this.enabled_phas}));
    if (page.data("page"))
	page.page("destroy").page();

    content.html(_this.view("index", {enabled_phas: _this.enabled_phas,
				disabled_phas: _this.disabled_phas,
				phas: _this.phas}));

    page.page("destroy").page();


		$(".app_management input[type='radio']").change (function(ev) {
			var elt = $(this);
			var m  = elt.closest("div.app_management").model();
			console.log("changed");
			console.log(elt);
			
			var command = m.id;
			
			$(this).attr("disabled", "true");
			$(this).text("Loading...");
			
			if (elt.val() === "disabled") {
			    command = "DELETE";
			    var x = "disabled_phas";
			    var y = "enabled_phas";
			}
			else if (elt.val()==="enabled") {
			    command = "PUT";
			    var y = "disabled_phas";
			    var x = "enabled_phas";
			}
			else {
			    throw "Expecting add or remove command, got " + command;
			}


			PHAController[y] = $.grep(PHAController[y], function(pha) {return (pha !== m)});
			PHAController[x].push(m); 
			PHAController[x].sort(PHA.compare);
			
			PHA.manipulate(command, ACCOUNT_ID, m.id, function() 
				       {
					   _this.manage();
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

".pha click": function(el) {
   var app = el.closest(".pha").model();
   this.launch_app(app);
}, 


launch_app: function(pha) {	
    new AppManifest({
	descriptor: pha.id,
	callback: function(manifest) {
	    var context = get_context(manifest);
 	    SMART.launch_app(manifest, context);
	    OpenAjax.hub.publish("pha.launched", pha);
	}
    });		
}

});