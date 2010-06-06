//from jQuery

MVC.Dom ={
    cache : {},
	expando : "mvc" + (+new Date),
	uuid : 0,
	window_data: {},
	data: function( elem, name, data ) {
		elem = elem == window ?
			MVC.Dom.window_data :
			elem;
        
		
		var id = elem[ MVC.Dom.expando ];

		// Compute a unique ID for the element
		if ( !id )
			id = elem[ MVC.Dom.expando ] = ++MVC.Dom.uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( !MVC.Dom.cache[ id ] )
			MVC.Dom.cache[ id ] = {};

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined )
			MVC.Dom.cache[ id ][ name ] = data;

		// Return the named cache data, or the ID for the element
		return name ?
			MVC.Dom.cache[ id ][ name ] :
			MVC.Dom.cache[ id ];
	},
	get_or_set_data : function(elem, name, data){
		var got = MVC.Dom.data(elem, name);
		return got ? got :  MVC.Dom.data(elem, name, data);
	},
	remove_data: function( elem, name ) {
		elem = elem == window ?
			MVC.Dom.window_data :
			elem;

		var id = elem[ MVC.Dom.expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( MVC.Dom.cache[ id ] ) {
				// Remove the section of cache data
				delete MVC.Dom.cache[ id ][ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in MVC.Dom.cache[ id ] )
					break;

				if ( !name )
					MVC.Dom.remove_data( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ MVC.Dom.expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( MVC.Dom.expando );
			}

			// Completely remove the data cache
			delete MVC.Dom.cache[ id ];
		}
	}
}