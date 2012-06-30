// more information: https://developer.mozilla.org/en/API/PageVisibility/Page_Visibility_API

;(function(window) {
	var document = window.document;
	var supported = false;
	var hiddenProperty;
	var visibilityChangeEvent;
	var visibilityStateProperty;
	var queue = [];
	
	if (typeof document.hidden !== 'undefined') { // spec, ready for future
		hiddenProperty = 'hidden';
		visibilityChangeEvent = 'visibilitychange';
		visibilityStateProperty = 'visibilityState';
		
	} else if (typeof document.mozHidden !== 'undefined') { // firefox 10+
		hiddenProperty = 'mozHidden';
		visibilityChangeEvent = 'mozvisibilitychange';
		visibilityStateProperty = 'mozVisibilityState';
		
	} else if (typeof document.msHidden !== 'undefined') { // ie 10+
		hiddenProperty = 'msHidden';
		visibilityChangeEvent = 'msvisibilitychange';
		visibilityStateProperty = 'msVisibilityState';
		
	} else if (typeof document.webkitHidden !== 'undefined') { // chrome 13+
		hiddenProperty = 'webkitHidden';
		visibilityChangeEvent = 'webkitvisibilitychange';
		visibilityStateProperty = 'webkitVisibilityState';
	}
	
	// is the API supported?
	supported = (typeof document.addEventListener !== 'undefined' && 
			typeof hiddenProperty !== 'undefined');
	
	// return the visibility of the page
	function isPageVisible() {
		var visible;
		
		if (supported) {
			visible = !document[hiddenProperty];
			
		} else {
			visible = true;
		}
		
		return visible;
	}
	
	// returns the visibility state
	function pageVisibilityState() {
		var visibilityState;
		
		if (supported) {
			visibilityState = document[visibilityStateProperty];
			
		} else {
			visibilityState = 'visible';
		}
		
		return visibilityState;
	}
	
	// i like the word call :-)
	function callCallback(callback) {
		callback.call(null, isPageVisible(), pageVisibilityState());
	}
	
	if (supported) {
		// handle page visibility change
		document.addEventListener(visibilityChangeEvent, function() {
			for (var i in queue) {
				callCallback(queue[i]);
			}
		}, false);
	}
	
	// expose to the outside world
	window.pageVisibility = {
		supportedBrowser: supported,
		addHandler: function(callback) {
			if (typeof callback === 'function') {
				
				// the API is supported
				if (supported) {
					// add it to the queue
					queue.push(callback);
				}
				
				// call the function with the current status
				callCallback(callback);
			}
		}
	};
})(this);
