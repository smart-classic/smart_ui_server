/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_common.Controllers.PHA',
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
        _this.phas = phas;
        
        PHA.get_all(function(phas) {
            var enabled_phas = [];
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

    this.element.html(this.view("index", {  
                          enabled_phas: PHAController.enabled_phas,
                          disabled_phas: PHAController.disabled_phas
    }));
    
    OpenAjax.hub.publish("request_visible_element", $('#app_content'));
    OpenAjax.hub.publish("pha.exit_app_context", "#manage_apps_req");
    
    var _this = this;
    $(".manage_apps BUTTON").click(function() {
        var command = $(this).attr('id');
        var app = null;
        
        $(this).attr("disabled", "true").text("Loading...");
        
        if (command.indexOf("remove_app_") > -1) {
            app = command.split("remove_app_")[1];
            command = "DELETE";
            var x = "disabled_phas";
            var y = "enabled_phas";
        }
        else if (command.indexOf("add_app_") > -1) {
            app = command.split("add_app_")[1];
            command = "PUT";
            var y = "disabled_phas";
            var x = "enabled_phas";
        }
        else {
            throw "Expecting 'add' or 'remove' command, got: '" + command + "'";
        }
        
        app = $.grep(PHAController.phas, function(pha) {
                                            return (pha.safeid() === app);
                                         }
        )[0];
        
        PHAController[y] = $.grep(PHAController[y], function(pha) {return (pha.id !== app.id)});
        PHAController[x].push(app); 
        PHAController[x].sort(PHA.compare);
        
        PHA.manipulate(command, ACCOUNT_ID, app.id, function() {
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
    pha.data.safe_id = pha.safeid();
    if (HIDDEN_APPS.indexOf(pha.id) === -1) {
        $('#app_selector_inner').append(this.view("app_list_item", { "app": pha.data }));
    }
    
    if (!RecordController.CURRENT_RECORD) {
        $('#app_selector_inner li:last').addClass('greyed_out');
    }
},

// called when clicking the app list item
"history.app_req.index subscribe" : function(called, data) {
    var app_id = data.id;
    location.hash = "app&id="+app_id;
    
    if (PHAController.phas && PHAController.phas.length > 0) {
        var app = $.grep(PHAController.phas, function(pha) {return (pha.safeid() === app_id);})[0];
        this.launch_app(app);
    }
},

// this gets called when the record changes on an active app
'pha.launch subscribe': function(topic, app) {
    this.launch_app(app);
},

'pha.exit_app_context subscribe': function(topic, new_context) 
{
    if (new_context === undefined) {
        new_context = "#patient_list_req";
    }
    $("#app_selector li a").removeClass("selected_app");
    $("#app_selector li a[href='"+new_context+"']").addClass("selected_app");
},

launch_app: function(pha) {
    $("#app_selector li a").removeClass("selected_app");
    $("#app_selector li a[href='#app_req&id="+pha.safeid()+"']").addClass("selected_app");
    
    // collect already running apps
    var already_running_instance = null;
    $.each(SMART.running_apps,
           function(aid, a){
               if (a.manifest.id === pha.id)
                   already_running_instance = a;
               }
           );
    
    // remember running apps that they will be sent to the background
    var about_to_background= [];
    $.each(SMART.running_apps,
           function(aid, a){
               if (a.app == RecordController.APP_ID)
                   about_to_background.push(a);
               }
           );
    
    // create an app manifest object to launch the app
    var self = this;
    new AppManifest({
        descriptor: pha.id,
        callback: function(manifest) {
            var context = get_context(manifest);
            
            if (manifest.scope !== "record") {
                delete RecordController.CURRENT_RECORD;
                OpenAjax.hub.publish("pha.exit_record_scope");
            }
            else if (!RecordController.CURRENT_RECORD || !RecordController.CURRENT_RECORD.record_id) {
                location.hash = "patient_list_req";
                setTimeout(function(){
                    alert("Please choose a patient before running this app.");      
                }, 1);
                return;
            }
            
            if (about_to_background.length > 0) {
                for (var i = 0; i < about_to_background.length; i++) {
                    SMART.notify_app("backgrounded", about_to_background[i]);
                };
            }
            
            // already running, just switch to it
            if (already_running_instance) {
                SMART.notify_app(already_running_instance, "foregrounded");
                RecordController.APP_ID = already_running_instance.manifest.id;
                OpenAjax.hub.publish("request_grow_app", $(already_running_instance.iframe));
                return;
            }
            
            // this is a standalone app, it doesn't use SMART Connect
            if (pha.data.standalone) {
                pha.manifest = manifest;
                self.launch_standalone_app(pha);
            }
            
            // launch SMART Connect app
            else {
                SMART.launch_app(manifest, context);
            }
        }
    });
},

/**
 *  Launch an app that is standalone.
 *  When calling this method, the app's manifest must have been fetched and appended to the app instance passed.
 */
launch_standalone_app: function(app) {
    if (!RecordController.CURRENT_RECORD || !RecordController.CURRENT_RECORD.record_id) {
        alert("Please select a record before launching this app");
        return;
    }
    if (!('manifest' in app)) {
        alert("This app's manifest has not yet been loaded, cannot launch this app");
        return;
    }
    
    // create the launch URL
    var launch_url = app.manifest.index;
    if (launch_url) {
        launch_url += "?api_base=" + encodeURIComponent(SMART_API_SERVER) + "&record_id=" + RecordController.CURRENT_RECORD.record_id;
    }
    app.launch_url = launch_url;
    
    RecordController.APP_ID = app.manifest.id;
    
    // show
    var main = $('#app_content');
    main.html(this.view('app_info', {'app': app}));
    OpenAjax.hub.publish("request_visible_element", main);
},

load_in_static_iframe: function(url) {
    if (!url) {
        alert("No URL given");
        return;
    }
    
    var stat_iframe = $('#static_app_iframe');
    if (!stat_iframe.is('*')) {
        stat_iframe = $('<iframe/>', {'id': 'static_app_iframe'});
        $('#app_content_iframe_holder').append(stat_iframe);
    }
    
    stat_iframe.attr('src', url);
    OpenAjax.hub.publish("request_visible_element", stat_iframe);
    OpenAjax.hub.publish("request_visible_element", stat_iframe.parent());
},

draw_phas: function() {
    $('.app').remove();
    var _this = this;
    jQuery.each(PHAController.enabled_phas, function(i,v){
        _this._add_app({'pha': v});
    });
}

});
