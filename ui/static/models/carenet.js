/*
 * the Carenet model
 */

Carenet = Class.extend({
  init: function(record_id, carenet_id, name) {
    this.record_id = record_id;
    this.carenet_id = carenet_id;
    this.name = name;
  },
   
    get_people: function(callback) {
	indivo_api_call("GET", '/carenets/' + this.carenet_id + '/accounts/', null, function(result) {
	    callback($(result).find('Account').map(function(i, account_xml_node) {
		return Account.from_xml_node(account_xml_node);
	    }));
	});
    },

    add_pha: function(pha, callback) {
	indivo_api_call("PUT", '/carenets/' + this.carenet_id + '/apps/' + pha.id, null, callback);
    },

    remove_pha: function(pha, callback) {
	indivo_api_call("DELETE", '/carenets/' + this.carenet_id + '/apps/' + pha.id, null, callback);
    },

    add_account: function(account_id, callback) {
	indivo_api_call("POST", '/carenets/' + this.carenet_id + '/accounts/', {'account_id' : account_id, 'write': '1'}, callback);
    },

    remove_account: function(account_id, callback) {
	indivo_api_call("DELETE", '/carenets/' + this.carenet_id + '/accounts/' + encodeURIComponent(account_id), null, callback);
    },
});

Carenet.from_xml_node = function(record_id, xml_node) {
    return new Carenet(record_id, $(xml_node).attr('id'), $(xml_node).attr('name'));
};