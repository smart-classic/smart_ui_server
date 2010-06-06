//
// JMVC Controller for HeathFeed
//
// Ben Adida (ben.adida@childrens.harvard.edu)
// Arjun Sanyal (arjun.sanyal@childrens.harvard.edu)
//

HealthfeedController= MVC.Controller.extend('healthfeed', {
  index: function(params) {
    var _this = this;
    ACCOUNT.get_healthfeed(function(notifications) {
      _this.notifications = _.map(notifications, function(n){
        // refactor me (IE doesn't like @attr, among many other things)
        // console.dir(n);
        var new_n = {};
        new_n.document = null;
        new_n.id = n['@id'];
        new_n.content = n.content;
        new_n.received_at = n.received_at;
        new_n.sender = n.sender;
        new_n.record = {};
        new_n.record.id = new_n.record['@id'];
        new_n.record.label = new_n.record['@label'];
        return new_n;
      })

      _this.render({to: 'app_content'});
      $('#app_content_iframe').hide();
      $('#app_content').show();
    });
  }
});