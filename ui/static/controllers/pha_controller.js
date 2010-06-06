//
// JMVC Controller for a single App, to
// set permissions, view logs, etc..
//
// Ben Adida (ben.adida@childrens.harvard.edu)
// Arjun Sanyal (arjun.sanyal@childrens.harvard.edu)
//

PHAController= MVC.Controller.extend('pha', {
    index: function(params) {
    var _this = this;
    
    _this.phas = {};
    _this.active_carenets = [];
    
    var record_id = params.record_id;
    var pha_id = params.pha_id;
    
    // get the record
    Record.get(record_id, null, function(record) {
        _this.record = record;
        
        // get the carenets for the current record
        record.get_carenets(null, function(carenets) {
        _this.carenets = carenets;
        
        // get the apps for each carenet
        $(carenets).each(function(i, carenet) {
            PHA.get_by_carenet(carenet.carenet_id, null, function(p) {
            _this.phas[carenet.carenet_id] = p;
            
            // check if the current PHA is in here
            if (_.detect(p, function(one_pha) {
                return one_pha.id == pha_id;
            })) {
                _this.active_carenets.push(carenet.carenet_id);
            }
            });
        });
        });
    });
    
    // get the app description
    PHA.get(record_id, pha_id, function(pha) {
        _this.pha = pha;
    });
    
    // display the page
    when_ready(function() {
        return (_this.pha && _this.record && _this.carenets && _.map(_this.carenets, function(i, c) {return _this.phas[c.carenet_id] != null;}));
    }, function() {
        $('#app_content_iframe').fadeOut(function(){
        $('#app_content').fadeIn(function(){
            _this.render({to: 'app_content'});
        });
        });

        $('#pha_carenets_form').submit(function() {
        $(this).find('input[name=carenet]').each(function(i, checkbox) {
            var the_carenet = _.select(_this.carenets, function(i) {return _this.carenets[i].carenet_id == checkbox.value;})[0];
            if (checkbox.checked) {
            // add the pha to the carenet
            the_carenet.add_pha(_this.pha);
            } else {
            // remove the pha from the carenet
            the_carenet.remove_pha(_this.pha);
            }
        });
        setTimeout("HealthfeedController.dispatch('index')", 0);
        return false;
        });
    });
    },
    
    
    
});