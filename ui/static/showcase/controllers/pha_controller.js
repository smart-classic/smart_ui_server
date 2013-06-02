/**
 * @tag controllers, home
 */
jQuery.Controller.extend('showcase.Controllers.PHA',
/* @Static */
{
},
/* @Prototype */
{
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
            if (typeof INITIAL_APP === "undefined") {
                _this.draw_phas();
            }
        });

        if (typeof INITIAL_APP !== "undefined") {
            var apps = phas.filter(function (p) {
                return p.id === INITIAL_APP;
            });
            if (apps.length > 0) {
                APP = apps[0];
            }
        }
    });
},

'pha.launch subscribe': function(topic, app) {
    this.launch_app(app);
}, 

'button.launch click': function(button) {
    var app = button.closest(".manage_apps").model();
    $('.iframe_holder', this).html("");
    $('.iframe_holder', this).show();
    this.launch_app(app);
},

'records.obtained subscribe': function(topic) {
    if (APP) {
        $('.iframe_holder', this).html("");
        $('.iframe_holder', this).show();
         this.launch_app(APP);
    } else {
        if (typeof INITIAL_APP !== "undefined") {
            alert ('App "' + INITIAL_APP + '" does not exist!');
        }
    }
},

launch_app: function(pha) {	
    $("iframe").fadeOut("fast");
    $("#loading_div").fadeIn("fast");
    new AppManifest({
	descriptor: pha.id,
	callback: function(manifest) {
	    var context = get_context(manifest);

	    if (manifest.scope !== "record")
	    {
		delete RecordController.RECORD_ID;
		delete RecordController.CURRENT_RECORD;
	    }

	    SMART.launch_app(manifest, context);
	    OpenAjax.hub.publish("pha.launched", pha);
	}
    });		
},

draw_phas :function() {
    this.element.html(this.view("index",
				{	
				    phas: this.phas,
				    message: this.labels
				}));
    
    $( "#app_accordion" ).accordion({collapsible: true, autoHeight: false, active: false});
    OpenAjax.hub.publish("request_visible_element", this.element);
}

});