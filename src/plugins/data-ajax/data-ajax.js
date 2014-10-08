/**
 * @title WET-BOEW Data Ajax [data-ajax-after], [data-ajax-append],
 * [data-ajax-before], [data-ajax-prepend] and [data-ajax-replace]
 * @overview A basic AjaxLoader wrapper that inserts AJAXed-in content
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author WET Community
 */
(function( $, window, wb ) {
"use strict";

/*
 * Variable and function definitions.
 * These are global to the plugin - meaning that they will be initialized once
 * per page, not once per instance of plugin on the page. So, this is a good
 * place to define variables that are common to all instances of the plugin on a
 * page.
 */
var componentName = "wb-data-ajax",
	selectors = [
		"[data-ajax-after]",
		"[data-ajax-append]",
		"[data-ajax-before]",
		"[data-ajax-prepend]",
		"[data-ajax-replace]"
	],
	selectorsLength = selectors.length,
	selector = selectors.join( "," ),
	initEvent = "wb-init." + componentName,
	updateEvent = "wb-update." + componentName,
	$document = wb.doc,
	s,

	/**
	 * @method init
	 * @param {jQuery Event} event Event that triggered this handler
	 * @param {string} ajaxType The type of AJAX operation, either after, append, before or replace
	 */
	init = function( event, ajaxType ) {

		// Start initialization
		// returns DOM object = proceed with init
		// returns undefined = do not proceed with init (e.g., already initialized)
		var elm = wb.init( event, componentName + "-" + ajaxType, selector );

		if ( elm ) {
			ajax.apply( this, arguments );

			// Identify that initialization has completed
			wb.ready( $( elm ), componentName, [ ajaxType ] );
		}
	},

	ajax = function( event, ajaxType ) {
		var elm = event.target,
			$elm = $( elm );

		$elm.trigger({
			type: "ajax-fetch.wb",
			fetch: {
				url: elm.getAttribute( "data-ajax-" + ajaxType )
			}
		});
	};

$document.on( "timerpoke.wb " + initEvent + " " + updateEvent + " ajax-fetched.wb", selector, function( event ) {
	var eventTarget = event.target,
		ajaxTypes = [
			"before",
			"replace",
			"after",
			"append",
			"prepend"
		],
		len = ajaxTypes.length,
		$elm, ajaxType, i, content, pointer;

	for ( i = 0; i !== len; i += 1 ) {
		ajaxType = ajaxTypes[ i ];
		if ( this.getAttribute( "data-ajax-" + ajaxType ) !== null ) {
			break;
		}
	}

	switch ( event.type ) {

	case "timerpoke":
	case "wb-init":
		init( event, ajaxType );
		break;
	case "wb-update":
		ajax( event, ajaxType );
		break;
	default:

		// Filter out any events triggered by descendants
		if ( event.currentTarget === eventTarget ) {
			$elm = $( eventTarget );

			// ajax-fetched event
			pointer = event.fetch.pointer;
			if ( pointer ) {
				content = pointer.html();

				// "replace" is the only event that doesn't map to a jQuery function
				if ( ajaxType === "replace") {
					$elm.html( content );
				} else {
					$elm[ ajaxType ]( content );
				}
			}
		}
	}

	/*
	 * Since we are working with events we want to ensure that we are being
	 * passive about our control, so returning true allows for events to always
	 * continue
	 */
	return true;
} );

// Add the timerpoke to initialize the plugin
for ( s = 0; s !== selectorsLength; s += 1 ) {
	wb.add( selectors[ s ] );
}

})( jQuery, window, wb );
