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
	PREFIX  foaf:  <http://xmlns.com/foaf/0.1/>\n\
	CONSTRUCT {?person ?p ?o.} \n\
	WHERE   {\n\
	  ?person ?p ?o.\n\
	  ?person foaf:familyName ?ln.\n\
	  ?person rdf:type foaf:Person.\n\
	}\n\
	order by ?ln",

index: function(params) {
    var _this = this;
    RecordController.APP_ID = null;
    this.element.html(this.view("index"));
    this.results_element = $('#patient_list_results');    
    OpenAjax.hub.publish("request_visible_element", $('#app_content'));
    OpenAjax.hub.publish("pha.exit_app_context", "#patient_list_req");            

    if (RecordController.CURRENT_RECORD === undefined)
	{
	    Record.search({sparql : this.sparql_base},  this.callback(this.process_list));
	    return;
	}
    this.display_list();

},
    
 process_list: function(records) {
  	    $("#patient_list_loading").text("");
  	      
		  for (var i=0; i < records.length; i++)
			  RecordController.RECENT_RECORDS[records[i].record_id] = records[i];
		  this.records = records;
		  this.display_list();

		  $(".record:first", this.element).click();
},

display_list: function() {  	      
    this.results_element.hide();
    this.results_element.html(this.view("results", {records: this.records}));
    this.results_element.fadeIn(160);
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