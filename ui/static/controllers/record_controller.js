//
// JMVC Controller for the Indivo Record
//

RecordController = MVC.Controller.extend('record', {
  // NOT called automatically on init! Called from main controller setup (workaround for IE issues
  // with include ordering -- ACCOUNT not being defined when this is called automatically)
  setup: function(params) {
    var _this = this;
    ACCOUNT.get_records(function(record_list) {
    RecordController.set_record_list(record_list);
    
    // init record tabs
    // TODO: use jquery "live" events (for newly created tabs)
    $('#record_tabs').tabs({
            // DO NOT use <DIV>'s here! Events won't fire!
            tabTemplate: '<li class="record_tab" title=""><a href="#{href}"><span>#{label}</span></a></li>'});
    
    jQuery.each(record_list, function(i,v){
            $('#record_tabs').tabs('add', '#'+v.id, v.label)
    })
    
    // color them
    // TODO: cycle colors
    $('.record_tab').each(function(i,v){
            COLORS = ['#eaeaea', '#eef', '#efe', '#fef', '#ffe', 'fee', '#eef', '#efe', '#fef', '#ffe', 'fee'];
            $(v).css({'background':COLORS[i]})
    });
    
    // add color events
    $('#record_tabs').bind('tabsselect', function(event, ui) {
            $('.box, .box h2, #app_selector, #app_content, #app_content_iframe').stop(true);
            event.stopPropagation();
            $('.box, .box h2, #app_selector, #app_content, #app_content_iframe').animate({
        backgroundColor: $(ui.tab).parent().css('background-color')
            }, 1000);
        
            RecordController.RECORD_ID = $(ui.tab).attr('href').substring(1);
        
        // make sure the iframe is hidden and the div is shown
        $('#app_content_iframe').hide();
        $('#app_content').show();
        
            RecordController.dispatch('_load_record');
    });
    
    // load the first record
    RecordController.RECORD_ID = record_list[0].id;
    _this._load_record();
    });
  },
  
  // "#record_id_selector change": function(params) {
  //   RecordController.RECORD_ID = params.element.value;
  //   this._load_record();
  // },

  // set_record_id: function(params) {
  //   RecordController.RECORD_ID = params.record_id;
  // },
  //   
  // set_app_id: function(params) {
  //   RecordController.APP_ID = params.app_id;
  // },
  // 
  // set_document_id: function(params) {
  //   RecordController.DOCUMENT_ID = params.document_id;
  // },

  _load_record: function() {
      var _this = this;
      var record_id = RecordController.RECORD_ID;
      
      if (record_id == "" || record_id == null) {
      $('#one_record').html("");
      return;
      }
      
      var record_info = RecordController.RECORDS[record_id];

      if (record_info.carenet_id) {
      $('#record_owned_options').hide();
      } else {
      $('#record_owned_options').show();
      }

      var record_load_callback = function(record) {
      PHA.get_all(function(phas) {
          _this.phas = phas;
          
          // get the ones associated with this record
          after_pha_callback = function(phas) {
          _this.record_phas = phas;
          
          MainController.dispatch('_clear_apps');
          HealthfeedController.dispatch('index');
          
          jQuery.each(phas, function(i,v){
              MainController.dispatch('_add_app', {'pha': v, 'fire_p': false, 'carenet_id': record_info.carenet_id})
          });
          
          // do we have an app selected?
          if (RecordController.APP_ID) {
              PHA.get(RecordController.RECORD_ID, RecordController.APP_ID, function(pha) {
              RecordController.dispatch('one_pha', {pha:pha});
              });
          }
              };
          
          if (record_info.carenet_id)
          PHA.get_by_carenet(record_info.carenet_id, null, after_pha_callback);
          else
          PHA.get_by_record(record.record_id, null, after_pha_callback)
      });
      };
      
      Record.get(record_id, record_info.carenet_id, function(record) {
      _this.record = record;
	  RecordController.CURRENT_RECORD = record;
      record_load_callback(record);
      });
  },

  ".pha click": function(params) {
    var _this = this;

    RecordController.APP_ID = params.element.id;

    PHA.get(RecordController.RECORD_ID, params.element.id, function(pha) {
      RecordController.dispatch('one_pha', {pha:pha});
    });

    params.event.kill();
  },

  ".close_pha click": function(params) {
    // FIXME, this is ugly
    RecordController.APP_ID = null;
    RecordController.DOCUMENT_ID = null;

    this._load_record();
    params.event.kill();
  },

  "one_pha": function(params) {
    this.pha = params.pha;
    
    // interpolate the start URL
    // this.pha.data.startURL = interpolate_url_template(this.pha.data.startURLTemplate, {'record_id' : RecordController.RECORD_ID, 'document_id' : RecordController.DOCUMENT_ID || ""});

    // this.render({to: 'one_record'});
  }
});

RecordController.set_record_list = function(rlist) {
    RecordController.record_list = rlist;
    RecordController.RECORDS = {};
    $(rlist).each(function(i, record) {
    RecordController.RECORDS[record.id] = record;
    });
};