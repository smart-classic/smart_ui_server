/*
 * JMVC Controller for the main Indivo application
 *
 * Ben Adida (ben.adida@childrens.harvard.edu)
 * Arjun Sanyal (arjun.sanyal@childrens.harvard.edu)
 */

MainController = MVC.Controller.extend('main', {
  load: function(params) {
      ACCOUNT = new Account(ACCOUNT_ID); // init the account via model
      SMART = new SMART_CONTAINER(function(app) {
	  // this is called when a new app is started
	  // credentials are bogus for now
	  return {'credentials' : 'foobar',
		  	  'record_info' : {
		      'full_name' : RecordController.CURRENT_RECORD.label,
		      'id' : RecordController.CURRENT_RECORD.record_id
		  }};
      });

      this.setup();
  },
    
  setup: function(params) {
    RecordController.dispatch('setup');

    // init the "app tabs"
    $("#app_selector").tabs();

    // Attach the Healthfeed click handler
    $('[href=\'#_healthfeed_tab_panel_hidden\']').click(function(){ HealthfeedController.dispatch('index'); });
    $('[href=\'#_patient_search_tab_panel_hidden\']').click(function(){ PatientSearchController.dispatch('index'); });
    // Run Healthfeed
    
    PatientSearchController.dispatch('index');
    

    $(window).resize(function() {
    	
    	var $elt = $("#app_content_iframe").is(":visible")? 
    			   $("#app_content_iframe") : $("#app_content");
    	
        $elt.hide();        	
        $elt.css("height", $("#bigbody").height()- 25);
        $elt.css("width", $("#bigbody").width()-175); // hard-wired width to match left-column width in CSS.  Sigh...  -JM
        $elt.show();    		
    });
    
    $(window).resize();
    $('#app_content_iframe').load( 
    		function() {
		    $('#app_content_iframe').show();
		    $('#app_content_iframe').focus();
		    $(window).resize();
    		});

  },

  _add_app: function(params) {
      // could use some refactoring, no?
      var pha = params.pha;
      var fire_p = params.fire_p;
      
      // add the tab, save the length-1 as index for removal closure
      $('#app_selector').tabs('add', '#'+pha.id.replace(/@/, '_at_').replace(/\./g,'_')  , pha.data.name);
      var len = $('#app_selector').tabs('length');
      
      var interpolation_args = function() { 
    	  return {
    		  'record_id' : RecordController.RECORD_ID,
    		  'account_id' : ACCOUNT_ID};
	  };
	  
      
      // Create a <div> for each pha, with maybe an image
      var img_name = pha.data.name.toLowerCase().replace(/ +/, '_')
      var line = '<img class="app_tab_img" src="/static/resources/images/app_icons_32/'+img_name+'.png" />';
      var remove_app_chunk = '&nbsp;<span id="#'+pha.id+'_delete_button'+'" style="cursor: pointer; color: #aaa;">[x]</span>';
      
      $('#app_selector_inner li:last').prepend(line);
      
      var first_span = $('#app_selector_inner li:last span')[0];
      
	  $('#app_selector_inner li:last').append(remove_app_chunk);
	  
	  // disabled for SMArt
	  
//	  var second_span = $('#app_selector_inner li:last span')[1];
//	  
//	  $(second_span).click(function(e){
//	      var id = this.id.replace(/_delete_button/, '')
//	      MainController.dispatch('_remove_app', {'id': id});
//	  });
//	  
//	  $(second_span).hide();
//
//	  
//	  $("#app_selector_inner li:last").hover(
//	      function(){ $(second_span).show() },
//	      function(){ setTimeout(function(){ $(second_span).hide();},100)}
//	  );
      
      // add the click handler
      $('#app_selector_inner li:last a').click(function(){
    	  startURL = interpolate_url_template(pha.data.startURLTemplate, interpolation_args);
    	  RecordController.APP_ID = params.pha.id;


    	  SMART.register_app(	params.pha.id, 
    			  				$('#app_content_iframe')[0],  
    			  				startURL);

    	  SMART.launch_app(	
    			params.pha.id, 
    			ACCOUNT_ID, 
    			RecordController.CURRENT_RECORD.record_id,     			  			
    	  		function() {
    				// load and show the iframe	   
    				$('#app_content').hide();
    				$('#app_content_iframe').attr('src',  startURL);    		  
    			});
      });
      
      // fire click event!!
      if (fire_p) $('#app_selector_inner li:last a').click();
  },

  _remove_app: function(params) {
    var id = params.id.substring(1);

    $.ajax({
      type: 'POST',
      data: {'app_id': id, 'record_id': RecordController.RECORD_ID},
      url: 'indivoapi/delete_record_app/',
      success: function(data, textstatus, xhr) {
        // shouldn't ever be called: fixme write onerror
        if (textstatus != 'success') { alert('Error in delete_record_app') };
	$('[href=\'#'+id.replace(/@/, '_at_').replace(/\./g,'_')+'\']').parent().remove();
	//        $('#app_selector').tabs();
      }
    });
  },

  // used when switching records
  _clear_apps: function(params) {
    var app_list_sans_hf = $('#app_selector_inner').children().slice(1);
    $.each(app_list_sans_hf, function(i, v){
      $(v).remove();
    })
  },

  "#sharing click": function(params) {
      SharingController.dispatch('index');
  }
});