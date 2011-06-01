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
	
load: function(params) {      
    ACCOUNT = Account.from_email(ACCOUNT_ID); // init the account via model
    SMART = new SMART_CONTAINER(SMART_HELPER);

    RecordController = new showcase.Controllers.Record($("#app_content"));
    PHAController = new showcase.Controllers.PHA($("#appnav"));
    PatientListController = new showcase.Controllers.PatientList($("#app_content"));

    this.previous_message =  $("#header .message").text();
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
    $("#back-to-showcase").fadeIn("fast");
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
    SMART.context_changed();
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