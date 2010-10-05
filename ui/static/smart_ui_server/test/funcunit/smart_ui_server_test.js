module("smart_ui_server test", { 
	setup: function(){
        S.open("//smart_ui_server/smart_ui_server.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});