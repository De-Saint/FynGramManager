(function($) {
	"use strict";
	
	timeline(document.querySelectorAll('.timeline-vertical-demo'), {
		forceVerticalMode: 1000,
		mode: 'vertical',
		verticalStartPosition: 'left',
		visibleItems: 4
	});
	
	
})(jQuery);