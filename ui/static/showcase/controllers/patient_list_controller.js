/**
 * @tag controllers, home
 */
jQuery.Controller.extend('showcase.Controllers.PatientList',
/* @Static */
{

},
/* @Prototype */
{	

init: function(params) {
	this.index();
},

sparql_base: "PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
	PREFIX  sp:  <http://smartplatforms.org/terms#>\n\
	PREFIX  foaf:  <http://xmlns.com/foaf/0.1/>\n\
	CONSTRUCT {?person rdf:type sp:Demographics.} \n\
	WHERE   { graph ?g {\n\
	  ?person rdf:type sp:Demographics.\n\
	}}",

index: function(params) {
    var _this = this;
    if (RecordController.CURRENT_RECORD === undefined)
    {
	Record.search({sparql : this.sparql_base},  this.callback(this.process_list));
	return;
    }
},
    
process_list: function(records) {
    records.sort(function(a,b) { if (a.label > b.label) return 1; if (a.label < b.label) return -1; return 0;});
    
    for (var i=0; i < records.length; i++)
	RecordController.RECENT_RECORDS[records[i].record_id] = records[i];

    RecordController.records = records;
    OpenAjax.hub.publish("records.obtained");

    var record= records[0];
    OpenAjax.hub.publish("patient_record.selected", record.record_id);
}
});
