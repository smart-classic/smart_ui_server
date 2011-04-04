/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server.Controllers.PatientList',
/* @Static */
{

},
/* @Prototype */
{	

init: function(params) {
	this.index();
},

'history.patient_list_req.index subscribe': function(called, data) {
    location.hash = "patient_list";
    this.index();
}, 

sparql_base: "PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
	PREFIX  sp:  <http://smartplatforms.org/terms#>\n\
	PREFIX  foaf:  <http://xmlns.com/foaf/0.1/>\n\
	CONSTRUCT {?person rdf:type sp:Demographics.} \n\
	WHERE   {\n\
	  ?person rdf:type sp:Demographics.\n\
	}",

index: function(params) {
    var _this = this;
    RecordController.APP_ID = null;
    this.element.html(this.view("index"));
    this.results_element = $('#patient_list_results');    
    OpenAjax.hub.publish("request_visible_element", $('#app_content'));
    RecordController.PAGE = this;
    OpenAjax.hub.publish("pha.exit_app_context", "#patient_list_req");            

    if (RecordController.CURRENT_RECORD === undefined)
	{
	    Record.search({sparql : this.sparql_base},  this.callback(this.process_list));
	    return;
	}
    this.display_list();

},
    
process_list: function(records) {
    records.sort(function(a,b) { if (a.label > b.label) return 1; if (a.label < b.label) return -1; return 0;});
    
    for (var i=0; i < records.length; i++)
	RecordController.RECENT_RECORDS[records[i].record_id] = records[i];
    RecordController.records = records;

    this.display_list();
    
    $(".record:first", this.element).click();
},

display_list: function() {  	      
    $("#patient_list_loading").text("");
    
    this.results_element.hide();
    this.results_element.html(this.view("results", {records: RecordController.records}));
    this.results_element.fadeIn(160);
    if ( RecordController.CURRENT_RECORD !== undefined)
	this.patient_selected(RecordController.CURRENT_RECORD.label);
},


patient_selected: function(name) {
    var _this = this;
    var sm = $('#patient_selected_header');
    sm.remove();
    sm = $(this.view("patient_selected", {name: name}));
    sm.hide();
    $("#header").flash("white", 200);

    this.element.prepend(sm);
    sm.fadeIn(160);

},

".record click": function(el) {
	  var name = $.trim($('div:first', el).text());
	  var record_id = el.closest(".record").model().record_id;
	  OpenAjax.hub.publish("patient_record.selected", record_id);
	  this.patient_selected(name);
}

});