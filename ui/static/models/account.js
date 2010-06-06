/*
 * Account model
 */
 
Account = Class.extend({
  init: function(email) {
    this.email = email;
    var self = this;
    $.getXML('/accounts/' + this.email, function(account_info){
      // fixme: get the whole package in some nicer format. we don't want to have to iterate over the props, do we?
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

  get_records: function(callback) {
      $.getXML('/accounts/' + this.email + '/records/', function(record_list) {
    var lst = record_list.Records.Record;
    if (!(lst instanceof Array)) lst = [lst];
    callback($(lst).map(function(el_num, el) {return {'id': el['@id'], 'label': el['@label'], 'shared': el['@shared'] != null, 'carenet_id': el['@carenet_id']};}));
    });
  },

  get_inbox: function(callback) {
    $.getXML('/accounts/' + encodeURIComponent(this.email) + '/inbox/', function(message_list) {
      var lst;
      try {
        lst = message_list.Messages.Message;
      } catch (e) {
        callback([]);
        return;
      }
      if (!lst) {
        callback([]);
        return;
      }
      callback($(lst).map(function(el_num, el) {return new Message(el);}));
    });
  },

  get_message: function(message_id, callback) {
    $.getXML('/accounts/' + encodeURIComponent(this.email) + '/inbox/' + encodeURIComponent(message_id), function(message) {
      var message;
      try {
        message = message.Message;
      } catch (e) {
        callback(null);
      }
      callback(new Message(message));
    });
  }
});

Account.from_xml_node = function(xml_node) {
    return new Account($(xml_node).attr('id'));
};