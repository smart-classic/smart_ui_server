//
// JMVC Controller for HeathFeed
//
// Ben Adida (ben.adida@childrens.harvard.edu)
// Arjun Sanyal (arjun.sanyal@childrens.harvard.edu)
//

PatientSearchController= MVC.Controller.extend('patient_search', {
  index: function(params) {
    var _this = this;

    _this.render({to: 'app_content'});

    $('#patient_search_form').inputHintOverlay(4,8);
    $('#patient_search_form').submit(function() {return _this.submit_form();});
    $('#app_content_iframe').hide();
    $('#app_content').show();
    $('#patient_search_sparql').val("@prefix smart: <http://smartplatforms.org/>.\nCONSTRUCT {?s ?p ?o.} WHERE \n{?s rdf:type smart:patient.  ?s ?p ?o. } ");
    
  },
  
  submit_form : function() {
	  var _this = this;
	  Record.search( $('#patient_search_form').formSerialize(), function(records) {
		  
		  _this.render({action: "results", to: "patient_search_results", using: {records: records}});
		  
		  $('.record_result').click(function() {
			  var record_id = $(".record_id", $(this)).html();
			  	    	  RecordController.RECORD_ID = record_id;
	    	  RecordController.dispatch("_load_record");
		  });
	  });
	  return false;
  }

	

});