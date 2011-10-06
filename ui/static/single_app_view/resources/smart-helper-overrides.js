SMART.get_iframe = function(app_instance, callback) {
    var frame = $("#app_iframe");
    frame.show();
    callback( frame[0] );
};

SMART.on_app_launch_complete = function(app_instance) {
    $("#loading").hide();

};

SMART.get_credentials = function(app_instance, callback) {
    callback(CREDENTIALS);
};