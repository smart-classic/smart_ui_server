/*
 * Account model
 */

Account = $.Model.extend('smart_common.Models.Account',
/* @Static */
{
	
  get_recent_records: function(email, callback) {
    $.getXML('/accounts/' + email + '/recent_records/', function(record_list) {
    try {
	 var lst = record_list.Records.Record;
    } catch (e) {return;}
	    
    if (!(lst instanceof Array)) lst = [lst];
    callback($.map(lst, function(el) {
		if (el === undefined) return null;
    	return new Record(
	    {record_id: el['@id'], 
	     label: el['@label'], 
	     demographics: el.demographics, 
	     base_url: '/records/' + encodeURIComponent(el['@id'])});    	
    	}));
    });
  },
  
  from_xml_node: function(xml_node) {
	    return this.from_email($(xml_node).attr('id'));
	},
  
  from_email: function(email) { 
   $.getXML('/accounts/' + email, function(account_info){
		return new Account({email: email, 
							account_id: account_info.Account['@id'], 
							username: account_info.Account.authSystem['@username']});  
   });
  }
}, 

/* @Prototype */
{ }

);
