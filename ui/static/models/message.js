/*
 *  Message model
 */

Message = Class.extend({
  init: function(xml_el) {
    this.id = xml_el['@id'];
    this.sender = xml_el['sender'];
    this.received_at = xml_el['received_at'];
    this.subject = xml_el['subject'];
    this.body = xml_el['body'];
  }
});