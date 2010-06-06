//
// JMVC Controller for the Indivo Messaging
//

MessagingController = MVC.Controller.extend('messaging', {
   index: function(params) {
     var _this = this;
     ACCOUNT.get_inbox(function(messages) {
     _this.messages = messages;
     _this.render({to: 'app_content'});
         $('#app_content_iframe').hide();
         $('#app_content').show();
     $('.message_subject').click(function(evt) {
         MessagingController.dispatch('one_message', {message_id: evt.target.id});
     });
     });
   },

   one_message: function(params) {
     var _this = this;
     ACCOUNT.get_message(params.message_id, function(message) {
     _this.message = message;
     _this.render({to: 'app_content', action: 'one_message'});
     $('.message_list').click(function() {
         MessagingController.dispatch('index');
     });
     });
   }
});