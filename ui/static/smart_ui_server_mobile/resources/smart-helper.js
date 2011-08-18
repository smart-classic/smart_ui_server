
SMART.get_iframe = function (app_instance, callback){
    var frame_id = "app_content_iframe_"+app_instance.uuid;

    $('#content_app').append(
	'<iframe SEAMLESS src="about:blank"'+
	    '" class="activity_iframe" id="'+frame_id+
	    '" width="100%" height="100%"> </iframe>');
    
    var frame = $("#"+frame_id);
    $("iframe").hide();
    frame.show();
    callback(frame[0]);
};

SMART.on_app_launch_begin = function(app_instance, callback) {
    $("#page_app div[data-role='header'] h1").text(app_instance.manifest.name);

    var page = $("#page_app");
    console.log("change page");
    $.mobile.changePage(page, {
	changeHash: true
    });

    callback();
};
