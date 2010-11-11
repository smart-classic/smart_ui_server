/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_ui_server.Controllers.PatientSearch',
/* @Static */
{

},
/* @Prototype */
{	

init: function(params) {
	this.index();
},
	

'history.patient_search_req.index subscribe': function(called, data) {
    location.hash = "patient_search";
    this.index();
}, 

index: function(params) {
    var _this = this;
    
    RecordController.APP_ID = null;
   
    this.element.html(this.view("index"));
    
    $('#patient_search_form').submit(function() {return _this.submit_form();});

    $('#patient_search_form INPUT').change(this.search_terms_changed);
    $('#patient_search_form INPUT').keyup(this.search_terms_changed);
    $('#patient_search_form INPUT:first').change();
    
    this.results_element = $('#patient_search_results');
    
    OpenAjax.hub.publish("request_visible_element", $('#app_content'));
},

patient_selected: function(name) {
    var _this = this;
    var sm = $('#patient_selected_header');
    sm.remove();
    sm = $(this.view("patient_selected", {name: name}));
    sm.hide();
    this.element.prepend(sm);
    sm.fadeIn(160);
},
  submit_form : function() {
	  var _this = this;
	  

	  var sb = $('#patient_search_form INPUT[type="submit"]');
	  var btext = sb.attr("value");
	  sb.attr("value", "Searching...");
	  sb.attr("disabled", "true");


	  Record.search({sparql : $("#patient_search_sparql").val()}, function(records) {
		  sb.attr("value", btext);
		  sb.removeAttr("disabled");
		  for (var i=0; i < records.length; i++)
			  RecordController.RECENT_RECORDS[records[i].record_id] = records[i];
		  
		  _this.results_element.hide();
		  _this.results_element.html(_this.view("results", {records: records}));
		  _this.results_element.fadeIn(160);

		  $('.record').click(function() {
			  var el = $(this);
			  var name = $('div', el).text();
			  var record_id = el.closest(".record").model().record_id;
			  OpenAjax.hub.publish("patient_record.selected", record_id);
			  _this.patient_selected(name);
		  });
	  });
	  return false;
  },
  
  search_terms_changed : function() {
	var sparql_base = "\
PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
PREFIX  spdemo:  <http://smartplatforms.org/demographics/>\n\
PREFIX  foaf:  <http://xmlns.com/foaf/0.1/>\n\
PREFIX  dc:  <http://purl.org/dc/elements/1.1/>\n\
PREFIX dcterms:  <http://purl.org/dc/terms/>\n\
CONSTRUCT {?person ?p ?o.} \n\
WHERE   {\n\
  ?person ?p ?o.\n\
  ?person foaf:familyName ?ln.\n\
  ?person rdf:type foaf:Person.{WHERE_givenName}{WHERE_familyName}{WHERE_DOB}{WHERE_sex}{WHERE_zip}{FILTER_givenName}{FILTER_familyName}{FILTER_DOB}{FILTER_sex}{FILTER_zip}\n\
}\n\
order by ?ln";
        

         var args = {WHERE_givenName : "", 
        		 WHERE_familyName : "", 
        		 WHERE_DOB : "", 
        		 WHERE_sex : "", 
        		 WHERE_zip : "", 
        		 FILTER_givenName: "", 
        		 FILTER_familyName : "", 
        		 FILTER_DOB : "", 
        		 FILTER_sex : "", 
        		 FILTER_zip : "" 
        		 };
         var r = $("#patient_search_lname").val();
         if (r != "") { 
        	 args.WHERE_familyName = '\n  ?person foaf:familyName ?familyName. ';
        	 args.FILTER_familyName = '\n  FILTER  regex(?familyName, "^'+r+'","i") ';	 
         }
         
         var r = $("#patient_search_fname").val();
         if (r != "") { 
        	 args.WHERE_givenName = '\n  ?person foaf:givenName ?givenName. ';
        	 args.FILTER_givenName = '\n  FILTER regex(?givenName, "^'+r+'","i") ';	 
         }
         
         var r = $("#patient_search_dob").val();
         if (r.length === 10) { 
        	 args.WHERE_DOB = '\n  ?person spdemo:birthday ?bday.';
        	 args.FILTER_DOB = '\n  FILTER regex(?bday, "^'+r+'$","i") ';	 
         }
         
         var r = $("#patient_search_zip").val();
         if (r != "") { 
        	 args.WHERE_DOB = '\n  ?person spdemo:zipcode ?zip. ';
        	 args.FILTER_DOB = '\n  FILTER regex(?zip, "'+r+'") ';	 
         }
         
         var r = $('input[name=patient_search_sex]:checked').val();
         if (r !== "" && r !== undefined) { 
        	 args.WHERE_sex = '\n  ?person foaf:gender ?sex. ';
        	 args.FILTER_sex = '\n  FILTER regex(?sex, "^'+r+'$","i") ';	 
         }
         
         $("#patient_search_sparql").val(interpolate_url_template(sparql_base, args));
  }


});