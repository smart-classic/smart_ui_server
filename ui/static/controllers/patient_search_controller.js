// SMArt bootstrap patient search controller
// Josh Mandel (joshua.mandel@childrens.harvard.edu)
 

PatientSearchController= MVC.Controller.extend('patient_search', {
  index: function(params) {
    var _this = this;
	RecordController.APP_ID = null;
	
    _this.render({to: 'app_content'});

    $('#patient_search_form').inputHintOverlay(4,8);
    $('#patient_search_form').submit(function() {return _this.submit_form();});
    $('#app_content_iframe').hide();
    $('#app_content').show();

    $('#patient_search_form INPUT').change(this.search_terms_changed);
    $('#patient_search_form INPUT').keyup(this.search_terms_changed);
    $('#patient_search_form INPUT:first').change();
    
    
  },
  
  submit_form : function() {
	  var _this = this;
	  Record.search({sparql : $("#patient_search_sparql").val()}, function(records) {
		  for (var i=0; i < records.length; i++)
			  RecordController.RECENT_RECORDS[records[i].record_id] = records[i];
		  _this.render({action: "results", to: "patient_search_results", using: {records: records}});
		  $("#patient_search_results").show();
		  $('.record_result').click(function() {
			  var record_id = $(".record_id", $(this).parent()).html();
			  RecordController.RECORD_ID = record_id;
	    	  RecordController.dispatch("_load_record");
		  });
	  });
	  return false;
  },
  
  search_terms_changed : function() {
	var sparql_base = "\
PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
PREFIX  sp:  <http://smartplatforms.org/>\n\
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
        

         args = {WHERE_givenName : "", 
        		 WHERE_familyName : "", 
        		 WHERE_DOB : "", 
        		 WHERE_sex : "", 
        		 WHERE_zip : "", 
        		 FILTER_givenName: "", 
        		 FILTER_familyName : "", 
        		 FILTER_DOB : "", 
        		 FILTER_sex : "", 
        		 FILTER_zip : "", 
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
        	 args.WHERE_DOB = '\n  ?person sp:birthday ?bday.';
        	 var m = r.substring(0,2);
        	 var d = r.substring(3,5);
        	 var y = r.substring(6,10);
        	 var ss_date = y+m+d;
        	 args.FILTER_DOB = '\n  FILTER regex(?bday, "^'+ss_date+'$","i") ';	 
         }
         
         var r = $("#patient_search_zip").val();
         if (r != "") { 
        	 args.WHERE_DOB = '\n  ?person sp:zipcode ?zip. ';
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