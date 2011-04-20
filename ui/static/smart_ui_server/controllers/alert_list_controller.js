/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server.Controllers.AlertList',
/* @Static */
{

},
/* @Prototype */
{	

init: function(params) {

},

'history.alert_list_req.index subscribe': function(called, data) {
    location.hash = "alert_list";
    this.index();
}, 

index: function(params) {
    var _this = this;

    Alert.get_all(RecordController.CURRENT_RECORD.record_id, function(alerts){
	    var ack = $.grep(alerts, function(a) {return (a.acknowledged_by != null)});
	    var unack = $.grep(alerts, function(a) {return (a.acknowledged_by == null)});
	    _this.element.html(_this.view("index", {alerts: unack, already: ack}));

    });

    OpenAjax.hub.publish("request_visible_element", $('#app_content'));
    RecordController.APP_ID = null;
    RecordController.PAGE = this;
    OpenAjax.hub.publish("pha.exit_app_context", "#alert_list_req");
},
    
".alert_acknowledge click": function(el) {
    var _this = this;
    el.attr("disabled", "true");
    var alert_id = el.closest(".alert").model().alert_id;
    Alert.acknowledge(ACCOUNT_ID, alert_id, function(){
	    _this.index();
	});
}

});