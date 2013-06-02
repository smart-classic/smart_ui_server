/**
 * @tag controllers, home
 */
jQuery.Controller.extend('showcase.Controllers.Main',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{
	
"{window} load": function(params) {
    if (typeof INITIAL_APP !== "undefined") {
        $("#appnav").hide();
    }

    ACCOUNT = Account.from_email(ACCOUNT_ID); // init the account via model

    RecordController = new showcase.Controllers.Record($("#app_content"));
    PHAController = new showcase.Controllers.PHA($("#appnav"));
    PatientListController = new showcase.Controllers.PatientList($("#app_content"));

    this.previous_message =  $("#header .message").text();

    SMART.on_app_ready = function(app_instance) {
        $("#loading_div").fadeOut("fast");
    };
    this.finish_initialization();
},

'request_visible_element subscribe': function(topic, element) {
    this.make_visible(element);
}, 

make_visible: function(element) {
    element.show();
},

'request_grow_app subscribe': function(topic, iframe) {
    $("iframe").hide();
    iframe.parent().show();
    iframe.show();
}, 
	
'pha.launched subscribe': function(topic, pha) {
    $("#patient-list").fadeIn("fast");
    if (typeof INITIAL_APP === "undefined") {
        $("#back-to-showcase").fadeIn("fast");
    }
    $("#header .message").text("Viewing app: " + pha.data.name);
    $("#appnav").hide();
    $("#showcase-content").css("height", "100%");
    $("#non-footer").css("height", "100%");
},


'#back-to-showcase click': function() {
    $("#patient-list").hide();
    $("#back-to-showcase").hide();
    $("#appnav").fadeIn("fast");
    $("iframe").remove();
    $("#showcase-content").css("height", "");
    $("#non-footer").css("height", "");
    $("#header .message").text(this.previous_message);
    //SMART.context_changed();
},

finish_initialization: function(params) {
    if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
    {
	$("#footer").css("position", "static");
    };
    
    OpenAjax.hub.publish("maincontroller.initialized");
    // TOOD: REfactor into height then width, so scrollbar logic can play out		
}

});