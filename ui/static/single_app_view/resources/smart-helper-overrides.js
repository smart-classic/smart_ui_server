var create_iframe = function(activity) {

    var interpolation_args = {
        'record_id' : RecordController.RECORD_ID,
        'account_id' : ACCOUNT_ID
    };
    
    startURL = interpolate_url_template(activity.resolved_activity.url, interpolation_args);
    RecordController.APP_ID = activity.resolved_activity.app;

    var frame = $("#app_iframe")[0];
    frame.src = startURL;
    $("#loading").hide();
    $(frame).show();
    return frame;
};
