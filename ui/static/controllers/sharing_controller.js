// Ben Adida (ben.adida@childrens.harvard.edu)
// Arjun Sanyal (arjun.sanyal@childrens.harvard.edu)

SharingController= MVC.Controller.extend('sharing', {
  index: function(params) {
    var _this = this;

    // get basic record info
    Record.get(RecordController.RECORD_ID, null, function(record) {
      _this.label = record.label;

      // get the carenets for this record
      record.get_carenets(null, function(carenets) {
        var accounts = {}
        _this.accounts = accounts;

        $(carenets).each(function(i, carenet) {
            carenet.get_people(function(a) { accounts[carenet.carenet_id] = a; });
        });

        var check_and_go = function() {
          // have all of the accounts loaded?
          if (carenets.length == 0 || _.all(_.map(carenets, function(i, c) {return accounts[c.carenet_id] != null;}))) {
            _this.carenets = carenets;

            _this.render({to: 'app_content'});
            $('#app_content_iframe').hide();
            $('#app_content').show();

            $('.remove_account').click(function(e) {
              var carenet_and_account = this.id.split('|');
              var carenet_id = carenet_and_account[0];
              var account_id = carenet_and_account[1];
              _this.remove_account(carenet_id, account_id);
              _this.index();
            });

            $('#add_carenet_account_form').submit(function(e) {
              var carenet_id = $(this).find('[name=carenet_id]').val();
              var account_id = $(this).find('[name=account_id]').val();
              _this.add_account(carenet_id, account_id);
              _this.index();
              return false;
            });
          } else {
            _.delay(check_and_go, 200);
          }
        }

        // call check_and_go
        _.delay(check_and_go, 200);
      });
    });
  },

    get_carenet: function(carenet_id) {
      return new Carenet(RecordController.RECORD_ID, carenet_id, null);
    },

    remove_account: function(carenet_id, account_id) {
      var carenet = this.get_carenet(carenet_id);
      if (confirm('are you sure you want to remove ' + account_id + ' ?')) { carenet.remove_account(account_id); }
      return false;
    },

    add_account: function(carenet_id, account_id) {
      var carenet = this.get_carenet(carenet_id);
      if (confirm('are you sure you want to share with ' + account_id + ' ?')) { carenet.add_account(account_id); }
      return false;
    },
});