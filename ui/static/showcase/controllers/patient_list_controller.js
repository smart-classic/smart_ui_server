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

index: function(params) {
    var _this = this;
    if (RecordController.CURRENT_RECORD === undefined)
    {
	Record.search({},  this.callback(this.process_list));
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
