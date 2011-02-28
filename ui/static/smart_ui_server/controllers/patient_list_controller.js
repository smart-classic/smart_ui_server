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
	  var name = $.trim($('span.pt_name', el).text());
	  var record_id = el.closest(".record").model().record_id;
	  OpenAjax.hub.publish("patient_record.selected", record_id);
	  this.patient_selected(name);
}

});


var sample_patient_descriptions = {
"1032702" : {"tags": "medications,problems",  "oneliner": "history of GERD"},
"1081332" : {"tags": "medications,problems",  "oneliner": "history of otitis media"},
"1098667" : {"tags": "medications,problems",  "oneliner": "history of colonic polyps, migraine, hypercholesterolemia"},
"1134281" : {"tags": "labs,medications,problems",  "oneliner": " history of otitis media, sinusitis."},
"1137192" : {"tags": "allergies,labs,medications,problems",  "oneliner": "history of benign prostitic hyperplasia, migraine, depression"},
"1157764" : {"tags": "labs,medications,problems",  "oneliner": "history of breast cancer, Crohn's disease, open angle glaucoma"},
"1186747" : {"tags": "medications,problems",  "oneliner": "history of ADHD, asthma"},
"1213208" : {"tags": "problems",  "oneliner": "history of hypertension, GERD, acute cellulitis"},
"1272431" : {"tags": "labs,problems",  "oneliner": "with history of prostate cancer, renal cancer, hyperlipidemia"},
"1288992" : {"tags": "allergies,labs,medications,problems",  "oneliner": "history of dementia, hypertension"},
"1291938" : {"tags": "problems",  "oneliner": "history of breast cancer, hyperlipidemia"},
"1482713" : {"tags": "medications,problems",  "oneliner": "history of eczema, otitis media, speech disturbance"},
"1520204" : {"tags": "labs,problems",  "oneliner": "history of COPD, osteoarthritis, hypertension, hyperlipidemia"},
"1540505" : {"tags": "labs,problems",  "oneliner": "history of Type 2 diabetes, hypertension, GERD."},
"1551992" : {"tags": "allergies,labs,problems",  "oneliner": "history of hypertension, osteoarthritis, COPD, gout"},
"1557780" : {"tags": "labs,medications,problems",  "oneliner": "history of hypertension, pulmonary emphysema, chronic bronchitis, GERD"},
"1577780" : {"tags": "labs,medications,problems",  "oneliner": "history of Type 2 diabetes, asthma, hypertension"},
"1614502" : {"tags": "medications,problems",  "oneliner": "history of otitis media"},
"1627321" : {"tags": "labs,problems",  "oneliner": "history of Type 2 diabetes, morbid obesity, gout, hypertension"},
"1642068" : {"tags": "labs,medications,problems",  "oneliner": "history of osteoarthritis, hypertension, pernicious anemia"},
"1685497" : {"tags": "allergies,medications,problems",  "oneliner": "history of Type 2 diabetes, hypertension, hyperlipidemia, obesity"},
"1768562" : {"tags": "labs,medications,problems",  "oneliner": "history of cardiomyopathy, CHF, atrial fibrillation, COPD, depression"},
"1796238" : {"tags": "labs,medications,problems",  "oneliner": "history of Type 2 diabetes, hypertension, chronic bronchitis"},
"1869612" : {"tags": "labs,medications,problems",  "oneliner": "history of chronic hepatitis C, Type 2 diabetes"},
"1951076" : {"tags": "labs,problems",  "oneliner": "history of depression, migraine, seizure, anorexia"},
"2004454" : {"tags": "labs,problems",  "oneliner": "history of otitis media, URI"},
"2042917" : {"tags": "labs,problems",  "oneliner": "history of hypertension, asthma, cocaine abuse"},
"2080416" : {"tags": "medications,problems",  "oneliner": "history of otitis media, cough"},
"2081539" : {"tags": "labs,problems",  "oneliner": "history of atrial fibrillation, hypertension, Type 2 diabetes"},
"2113340" : {"tags": "labs,medications,problems",  "oneliner": "history of Type 2 diabetes, hyperlipidemia, acute myocardial infarction"},
"2169591" : {"tags": "allergies,labs,medications,problems",  "oneliner": "history of hypothyroidism, HSV, hyperlipidemia"},
"2347217" : {"tags": "labs,problems",  "oneliner": "history of hypertension, hypercholesterolemiaj"},
"2354220" : {"tags": "labs,medications,problems",  "oneliner": "history of COPD, uterine leiomyoma, anemia"},
"2502813" : {"tags": "labs,medications,problems",  "oneliner": "history of hypertension, COPD, stress incontinence"},
"613876" : {"tags": "problems",  "oneliner": "history of hypothyroidism"},
"621799" : {"tags": "allergies,labs,problems",  "oneliner": "history of myocardial infarction, congestive heart failure, hyperlipidemia"},
"629528" : {"tags": "labs,medications,problems",  "oneliner": "history of CIN grade 1, HPV, depression"},
"640264" : {"tags": "problems",  "oneliner": "history of hypertension, hemorrhoids, irregular periods"},
"644201" : {"tags": "medications,problems",  "oneliner": "history of hypertension, hyperlipidemia, osteoporosis"},
"665677" : {"tags": "labs,medications,problems",  "oneliner": "history of Type 2 diabetes, renal carcinoma, hypertension"},
"724111" : {"tags": "problems",  "oneliner": "history of hyperlipidemia, depression, sinusitis"},
"731673" : {"tags": "medications,problems",  "oneliner": "history of hypertension, anxiety, vertigo, UTI"},
"736230" : {"tags": "labs,medications,problems",  "oneliner": "history of hypothyroidism"},
"765583" : {"tags": "labs,medications,problems",  "oneliner": "history of breast cancer"},
"767980" : {"tags": "labs,medications,problems",  "oneliner": "history of Type 2 diabetes, peptic ulcer, hypertension, hypercholesterolemia"},
"880378" : {"tags": "medications,problems",  "oneliner": "history of otitis media, sinusitis, URI"},
"897185" : {"tags": "allergies,problems",  "oneliner": "history of hyperlipidemia, acute bronchitis, head injury"},
"935270" : {"tags": "medications,problems",  "oneliner": "history of coronary arteriosclerosis, hypertension, hyperlipidemia"},
"967332" : {"tags": "labs,medications,problems",  "oneliner": "History of hypertension, asthma, sleep apnea"},
"981968" : {"tags": "medications,problems",  "oneliner": "history of asthma, GERD, gout"}
}

