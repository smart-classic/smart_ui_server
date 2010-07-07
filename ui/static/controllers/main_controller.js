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
    $('#app_selector_inner li:first a').click(function(){ HealthfeedController.dispatch('index'); });

    // Attach the Healthfeed click handler
    $('#inbox_li a').click(function(){ MessagingController.dispatch('index'); });

    // init "app add overlay"
    MainController.dispatch('_init_get_more_apps_overlay');

    // Run Healthfeed
    HealthfeedController.dispatch('index');
    

    $(window).resize(function() {
    	
    	var $elt = $("#app_content_iframe").is(":visible")? 
    			   $("#app_content_iframe") : $("#app_content");
    	
        $elt.hide();
        	
        $elt.css("height", $("#bigbody").height()- 25);
        $elt.css("width", $("#bigbody").width()-175);
                        
        $elt.show();    		
    });
    
    $(window).resize();
    $('#app_content_iframe').load( 
    		function() {
		    $('#app_content_iframe').show();
		    $('#app_content_iframe').focus();
		    $(window).resize();
    		});


    // init complete
    
 //   $("#CloseApp a").click(function() {
//        $('#app_content_iframe').addClass("grid_12");
 //       $('#app_content_iframe').removeClass("fullScreen");
 //       $('#app_content_iframe').attr("src","about:blank");
 //       $('#CloseApp').hide();
        
 //   	HealthfeedController.dispatch('index');
 //   });
  },

  _init_get_more_apps_overlay: function(){
    // we configure and set up the onBeforeLoad callback for the overlay here
    $("a#get_more_apps").overlay({
      expose: {color: "#fff", opacity: 0.7, loadSpeed: 2000},
      onBeforeLoad: function(){
        // function to run to get the available app data before the overlay is shown
        var wrap = this.getContent().find("div.wrap");
        $('.wrap').empty().html('<h2>Available Apps</h2><br/>');

        PHA.get_all(function(phas) {
         PHA.get_by_record(RecordController.RECORD_ID, null, function(record_phas){

            $.each(phas, function(i,v){
              var pha = phas[i];
              var record_pha_ids = $.map(record_phas, function(e){ return e.id; });

              // check that this record doesn't already have this app
              if ($.inArray(pha.id, record_pha_ids) > -1) { return true; }

              // Create a <div> for each pha, with maybe an image
              // todo: be dry! see _add_app below!
              var img_name = pha.data.name.toLowerCase().replace(/ +/, '_')
              var line = '<a><img class="app_tab_img" src="/static/resources/images/app_icons_32/'+img_name+'.png" />';
              line += ''+pha.data.name;
              if (pha.data.description && pha.data.description != "None") line += '&nbsp;&ndash;&nbsp;<i>'+pha.data.description+'</i>';
              line += '</a>'

              var e = $('<div class="pha">').attr('id', pha.id).html(line);

              // Attach click handlers to each
              e.click(function(e){
                $("a#get_more_apps").overlay().close();
                MainController.dispatch('_add_app', {'pha': pha, 'fire_p': true})
              })

              $('.wrap').append(e);
            }) // each
          });
        }); // get_all
        wrap.load();
      } // onBeforeLoad
    });
  },
  _add_app: function(params) {
      // could use some refactoring, no?
      var pha = params.pha;
      var fire_p = params.fire_p;
      
      // add the tab, save the length-1 as index for removal closure
      $('#app_selector').tabs('add', '#'+pha.id.replace(/@/, '_at_').replace(/\./g,'_')  , pha.data.name);
      var len = $('#app_selector').tabs('length');
      
      var interpolation_args = {
	  'record_id' : params.carenet_id? "":RecordController.RECORD_ID,
	  'document_id' : RecordController.DOCUMENT_ID || "",
	  'carenet_id' : params.carenet_id || ""
      };
      var startURL = interpolate_url_template(pha.data.startURLTemplate, interpolation_args);
      
      // Create a <div> for each pha, with maybe an image
      var img_name = pha.data.name.toLowerCase().replace(/ +/, '_')
      var line = '<img class="app_tab_img" src="/static/resources/images/app_icons_32/'+img_name+'.png" />';
      var remove_app_chunk = '&nbsp;<span id="#'+pha.id+'_delete_button'+'" style="cursor: pointer; color: #aaa;">[x]</span>';
      var prefs_app_chunk = '&nbsp;<span id="#'+pha.id+'_prefs_button'+'" style="cursor: pointer; color: #aaa;">[prefs]</span>';
      
      $('#app_selector_inner li:last').prepend(line);
      
      var first_span = $('#app_selector_inner li:last span')[0];
      
      // all of this stuff only makes sense if we're not in a carenet
      if (!params.carenet_id) {
	  $('#app_selector_inner li:last').append(remove_app_chunk);
	  
	  // disabled for SMArt
	  $('#app_selector_inner li:last').append(prefs_app_chunk);
	  
	  var second_span = $('#app_selector_inner li:last span')[1];
	  var third_span = $('#app_selector_inner li:last span')[2];
	  
	  $(second_span).click(function(e){
	      var id = this.id.replace(/_delete_button/, '')
	      MainController.dispatch('_remove_app', {'id': id, 'index': len-1});
	  });
	  
	  $(second_span).hide();
	  
	  $(third_span).click(function(e) {
	      var id = this.id.replace(/_prefs_button/, '')
	      PHAController.dispatch('index', {'record_id': RecordController.RECORD_ID, 'pha_id': pha.id});
	  });
	  
	  $(third_span).hide();
	  
	  $("#app_selector_inner li:last").hover(
	      function(){ $(second_span).show() },//; $(third_span).show() ; },
	      function(){ setTimeout(function(){ $(second_span).hide();},100)}// $(third_span).hide();},1500)}
	  );
      }
      
      // add the click handler
      $('#app_selector_inner li:last a').click(function(){
	  // set up the app as being added
    	  RecordController.APP_ID = params.pha.id;
    	  RecordController.CURRENT_RECORD.add_app(params.pha.id, function() {
	      // set up the SMArt API for this
	      SMART.register_app(params.pha.id, $('#app_content_iframe')[0], startURL);
	      
	      // load and show the iframe	   
		    $('#app_content').hide();
		    $('#app_content_iframe').attr('src', startURL);
	    
	  });
      });
      
      // fire click event!!
      if (fire_p) $('#app_selector_inner li:last a').click();
  },

  _remove_app: function(params) {
    var id = params.id.substring(1);
    var index = params.index;

    $.ajax({
      type: 'POST',
      data: {'app_id': id, 'record_id': RecordController.RECORD_ID},
      url: 'indivoapi/delete_record_app/',
      success: function(data, textstatus, xhr) {
        // shouldn't ever be called: fixme write onerror
        if (textstatus != 'success') { alert('Error in delete_record_app') };
        // destroy, delete tab ul, and re-init -- workaround tabs lameness
	//        $('#app_selector').tabs('destroy');
	//	alert("destroyed tabs, now removing  " + index);
        $('#app_selector_inner li:eq('+index+')').remove();
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