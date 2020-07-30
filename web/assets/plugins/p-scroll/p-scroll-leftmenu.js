(function($) {
	"use strict";
	
	//P-scrolling
	const ps = new PerfectScrollbar('.first-sidemenu', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	const ps1 = new PerfectScrollbar('.second-sidemenu', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	const ps5 = new PerfectScrollbar('.drop-scroll', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	const ps6 = new PerfectScrollbar('.drop-notify', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	
})(jQuery);