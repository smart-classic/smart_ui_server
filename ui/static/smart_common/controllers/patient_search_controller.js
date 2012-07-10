/**
 * @tag controllers, home
 */
jQuery.Controller.extend('smart_common.Controllers.PatientSearch',
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


	  Record.search(this.search_params(), function(records) {
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
  
  search_params : function() {
	var search_params = {};
         var r = $("#patient_search_lname").val();
         if (r != "") { 
		search_params['family_name'] = r;
         }
         
         var r = $("#patient_search_fname").val();
         if (r != "") { 
		search_params['given_name'] = r;
         }
         
         var r = $("#patient_search_dob").val();
         if (r.length === 10) { 
		search_params['birthday'] = r;
         }
         
         var r = $("#patient_search_zip").val();
         if (r != "") { 
		search_params['zipcode'] = r;
         }
         
         var r = $('input[name=patient_search_sex]:checked').val();
         if (r !== "" && r !== undefined) { 
		search_params['gender'] = r;
         }
  
	return search_params;        
  }


});
