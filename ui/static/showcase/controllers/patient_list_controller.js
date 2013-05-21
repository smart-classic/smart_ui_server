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

    // IE Compatibility Fix
    if (!Array.prototype.filter) {
      Array.prototype.filter = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
        throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
          if (i in this) {
            var val = this[i]; // in case fun mutates this
            if (fun.call(thisp, val, i, this))
            res.push(val);
          }
        }
        return res;
      };
    }
    
    if (typeof PATIENTS !== "undefined") {
        records = records.filter(function (r) {
            return $.inArray(r.record_id, PATIENTS.split(",")) > -1;
        });
    }

    records.sort(function(a,b) { if (a.label > b.label) return 1; if (a.label < b.label) return -1; return 0;});
    
    for (var i=0; i < records.length; i++)
	RecordController.RECENT_RECORDS[records[i].record_id] = records[i];

    RecordController.records = records;
    OpenAjax.hub.publish("records.obtained");

    var record = records[0];
    OpenAjax.hub.publish("patient_record.selected", record.record_id);
}
});
