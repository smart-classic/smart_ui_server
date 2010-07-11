/*
 * Account model
 */
 
Account = Class.extend({
  init: function(email) {
    this.email = email;
    var self = this;
 
    $.getXML('/accounts/' + this.email, function(account_info){
      self.account_id = account_info.Account['@id'];
      self.username = account_info.Account.authSystem['@username'];
    });
  },
  
  get_healthfeed: function(callback) {
    $.getXML('/accounts/' + this.email + '/notifications/', function(notifications_xml) {
      var notifications = notifications_xml.Notifications.Notification;
      if (!notifications) notifications = [];
      if (!(notifications instanceof Array)) notifications = [notifications];
      callback(notifications);
    });
  },
  
  add_app: function(app_id, callback) {
	
	//************ todo FIll here.  
  },
  
  get_recent_records: function(callback) {
    $.getXML('/accounts/' + this.email + '/recent_records/', function(record_list) {
    var lst = record_list.Records.Record;
    if (!(lst instanceof Array)) lst = [lst];
    callback($(lst).map(function(el_num, el) {return {'id': el['@id'], 'label': el['@label'], 'shared': el['@shared'] != null, 'carenet_id': el['@carenet_id']};}));
    });
  },
});

Account.from_xml_node = function(xml_node) {
    return new Account($(xml_node).attr('id'));
};