new Test.Controller('todos',{
	test_mouseover: function(){
		var action = this.TodoMouseover();
		this.assert(action.element.style.backgroundColor)
	},
	test_mouseout: function(){
		var action = this.TodoMouseout();
		this.assert_not(action.element.style.backgroundColor)
	}
})