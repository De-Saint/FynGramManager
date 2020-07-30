(function($) {
	"use strict";
	
	//P-scrolling
	const ps = new PerfectScrollbar('.sidebar-left', {
	useBothWheelAxes:false,
	});
	const ps1 = new PerfectScrollbar('.toggle-sidebar', {
	 useBothWheelAxes:false,
	  suppressScrollX:false,
	});
	const ps2 = new PerfectScrollbar('.drop-scroll', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	const ps3 = new PerfectScrollbar('.drop-notify', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	const ps4 = new PerfectScrollbar('.drop-cart', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	
	
})(jQuery);