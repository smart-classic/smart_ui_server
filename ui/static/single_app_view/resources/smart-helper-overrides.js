SMART.get_iframe = function(app_instance, callback) {
    var frame = $("#app_iframe");
    frame.show();
    callback( frame[0] );
};
