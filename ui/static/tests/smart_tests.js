module("Reference SMArt Platform",{
	setup : function(){
		S.open("http://localhost:7001/login")
	}
})

test("Developer Login", function(){

	S(function() {
		S("#username").type("developer", function(){
		  equals(S("#username").val(), "developer","typing");
		});

		S("#password").type("test", function(){
		  equals(S("#password").val(), "test","typing");
		});

		S("#submit").click();
	    });

	S("#working_with").exists(function() {
		ok(S("#working_with"), "We've logged in.");
	    });
    });

module("Reference SMArt Platform",{
	setup : function(){
		S.open("http://localhost:7001/")
	}
})

get_patient = function() {
	   S("#patient_search_lname").exists(function() {
   	     S("#patient_search_lname").type("Bach");
	     S("#patient_search_fname").type("Hiram");
	     S("INPUT[type=submit]").click(1000);
	   });


	S(".record_result").exists(function() {
		equal(S(".record_result").size(), 1, "Found patient Hiram Bach");
		S(".record_result:first A").click();
	});

	S("#current_patient option").size(function(s) {return s > 1;}, 
					   function() {
					       ok(true, "Updated Context Patient" + S("#current_patient option").text());
					   });
};


test("App Add / Remove", function(){
	S("#manage_apps_link").exists().wait(100);
	S("#manage_apps_link").click();
	S("UL.manage_apps").exists();

	S(function() {
	  if (S("#remove_app_am-i-on-a-statin_at_apps_smart_org").size() == 1) {
	    S("#remove_app_am-i-on-a-statin_at_apps_smart_org").click();
	  }

	  S("#add_app_am-i-on-a-statin_at_apps_smart_org").exists( function () {
		  S("#add_app_am-i-on-a-statin_at_apps_smart_org").click();		   
	      });
	    });

	S(function() {
	  if (S("#remove_app_api-playground_at_apps_smart_org").size() == 1) {
	    S("#remove_app_api-playground_at_apps_smart_org").click();
	  }

	  S("#add_app_api-playground_at_apps_smart_org").exists( function () {
		  S("#add_app_api-playground_at_apps_smart_org").click();		   
	      });
	    });


	
    });

test("Statin App", function(){
	get_patient();

	S("A[href=#app/am-i-on-a-statin_at_apps_smart_org]").exists(function(){
	  equal(S("A[href=#app/am-i-on-a-statin_at_apps_smart_org]").size(), 1, "Added Statin App");
	  S("A[href=#app/am-i-on-a-statin_at_apps_smart_org]").click();  
	  
	});

	S(function() {
		S("#TheAnswer", 0).html(
					function(x) {
					    return (x === "No." || x === 'Yes.');
					},
					function() {
					    ok(function(){var x = S("#TheAnswer", 0); return (x === "No." || x === 'Yes.');},
					       "Statin App Returned "+S("#TheAnswer", 0).html());
					});
	});

	    
      
})


test("API Playground", function(){
	get_patient();

	S("A[href=#app/api-playground_at_apps_smart_org]").exists(function(){
	  equal(S("A[href=#app/api-playground_at_apps_smart_org]").size(), 1, "Added API Playground");
	  S("A[href=#app/api-playground_at_apps_smart_org]").click();  
	  
	});

	var response = S("#Response", 0);
	var current_button = S(".button_row BUTTON", 0);
	var selectors = [
			 S("SPAN[name='/records/{record_id}/problems/'] BUTTON[value='DELETE']",0),
			 S("SPAN[name='/records/{record_id}/problems/'] BUTTON[value='POST']",0),
			 S("SPAN[name='/records/{record_id}/problems/'] BUTTON[value='GET']",0),
			 S("SPAN[name='/records/{record_id}/problems/'] BUTTON[value='DELETE']",0),

			 S("SPAN[name='/records/{record_id}/problems/external_id/{external_id}'] BUTTON[value='PUT']",0),
			 S("SPAN[name='/records/{record_id}/problems/external_id/{external_id}'] BUTTON[value='GET']",0),
			 S("SPAN[name='/records/{record_id}/problems/external_id/{external_id}'] BUTTON[value='DELETE']",0),

			 S("SPAN[name='/records/{record_id}/medications/'] BUTTON[value='DELETE']",0),
			 S("SPAN[name='/records/{record_id}/medications/'] BUTTON[value='POST']",0),
			 S("SPAN[name='/records/{record_id}/medications/'] BUTTON[value='GET']",0),
			 S("SPAN[name='/records/{record_id}/medications/'] BUTTON[value='DELETE']",0),

			 S("SPAN[name='/records/{record_id}/medications/external_id/{external_id}'] BUTTON[value='PUT']",0),
			 S("SPAN[name='/records/{record_id}/medications/external_id/{external_id}'] BUTTON[value='GET']",0),
			 S("SPAN[name='/records/{record_id}/medications/external_id/{external_med_id}/fulfillments/external_id/{external_fill_id}'] BUTTON[value='PUT']",0),
			 S("SPAN[name='/records/{record_id}/medications/external_id/{external_med_id}/fulfillments/external_id/{external_fill_id}'] BUTTON[value='GET']",0),
			 S("SPAN[name='/records/{record_id}/medications/external_id/{external_med_id}/fulfillments/external_id/{external_fill_id}'] BUTTON[value='DELETE']",0),
			 S("SPAN[name='/records/{record_id}/medications/external_id/{external_id}'] BUTTON[value='DELETE']",0),


                     ];

	for (var i = 0; i < selectors.length; i++) 
	{
	    var tmp = function(i) {
	    S(function() {
		    selectors[i].exists(function() {
			    selectors[i].click().wait(50);
			    current_button.exists();
			    current_button.click();
			    response.visible(function() {
				    ok(true, "Respose received for "+selectors[i].selector);
				});
		    });
		});
	    }(i);
        }

    });