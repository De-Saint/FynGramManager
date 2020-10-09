(function($) {
	"use strict";
	
	// ______________Active Class
	$(".app-sidebar .toggle-menu.side-menu a").each(function() {
		var pageUrl = window.location.href.split(/[?#]/)[0];
		if (this.href == pageUrl) {
			$(this).addClass("active");
			$(this).parent().addClass("active"); // add active to li of the current link
			$(this).parent().parent().prev().addClass("active"); // add active class to an anchor
			$(this).parent().parent().prev().click(); // click the item to make it drop
		}
	});
	
	// ______________ Modal
	$("#myModal").modal('show');
	
	$(document).ready(function() {
		$("a[data-theme]").click(function() {
			$("head link#theme").attr("href", $(this).data("theme"));
			$(this).toggleClass('active').siblings().removeClass('active');
		});
		$("a[data-effect]").click(function() {
			$("script#effect").attr("src", $(this).data("effect"));
			$(this).toggleClass('active').siblings().removeClass('active');
		});
	});
	
	// ______________Cover Image
	$(".cover-image").each(function() {
		var attr = $(this).attr('data-image-src');
		if (typeof attr !== typeof undefined && attr !== false) {
			$(this).css('background', 'url(' + attr + ') center center');
		}
	});
	
//	// ______________Loader
//	$(window).on("load", function(e) {
//		$("#loading").fadeOut("slow");
//	})
	
	
	// ______________Horizontal-menu Active Class
	$(document).ready(function() {
		$(".horizontalMenu-list li a").each(function() {
			var pageUrl = window.location.href.split(/[?#]/)[0];
			if (this.href == pageUrl) {
				$(this).addClass("active");
				$(this).parent().addClass("active"); // add active to li of the current link
				$(this).parent().parent().prev().addClass("active"); // add active class to an anchor
				$(this).parent().parent().prev().click(); // click the item to make it drop
			}
		});
	});
	
	// ______________ GLOBAL SEARCH
	$(document).on("click", "[data-toggle='search']", function(e) {
		var body = $("body");

		if(body.hasClass('search-gone')) {
			body.addClass('search-gone');
			body.removeClass('search-show');
		}else{
			body.removeClass('search-gone');
			body.addClass('search-show');
		}
	});
	
	// ______________LEFTMENU
	var toggleSidebar = function() {
		var w = $(window);
		if(w.outerWidth() <= 1024) {
			$("body").addClass("sidebar-gone");
			$(document).off("click", "body").on("click", "body", function(e) {
				if($(e.target).hasClass('sidebar-show') || $(e.target).hasClass('search-show')) {
					$("body").removeClass("sidebar-show");
					$("body").addClass("sidebar-gone");
					$("body").removeClass("search-show");
				}
			});
		}else{
			$("body").removeClass("sidebar-gone");
		}
	}
	toggleSidebar();
	$(window).resize(toggleSidebar);
	
	// ______________ Back to Top
	$(window).on("scroll", function(e) {
		if ($(this).scrollTop() > 0) {
			$('#back-to-top').fadeIn('slow');
		} else {
			$('#back-to-top').fadeOut('slow');
		}
	});
	$("#back-to-top").on("click", function(e) {
		$("html, body").animate({
			scrollTop: 0
		}, 600);
		return false;
	});
	
//	// ______________Rating Stars
//	var ratingOptions = {
//		selectors: {
//			starsSelector: '.rating-stars',
//			starSelector: '.rating-star',
//			starActiveClass: 'is--active',
//			starHoverClass: 'is--hover',
//			starNoHoverClass: 'is--no-hover',
//			targetFormElementSelector: '.rating-value'
//		}
//	};
//	$(".rating-stars").ratingStars(ratingOptions);
//	
	
	// ______________Search
	$('body, .navbar-collapse form[role="search"] button[type="reset"]').on('click keyup', function(event) {
		if (event.which == 27 && $('.navbar-collapse form[role="search"]').hasClass('active') ||
		$(event.currentTarget).attr('type') == 'reset') {
		closeSearch();
		}
	});
	function closeSearch() {
		var $form = $('.navbar-collapse form[role="search"].active')
		$form.find('input').val('');
		$form.removeClass('active');
	}
	// Show Search if form is not active // event.preventDefault() is important, this prevents the form from submitting
	$(document).on('click', '.navbar-collapse form[role="search"]:not(.active) button[type="submit"]', function(event) {
		event.preventDefault();
		var $form = $(this).closest('form'),
		$input = $form.find('input');
		$form.addClass('active');
		$input.focus();
	});
	// if your form is ajax remember to call `closeSearch()` to close the search container
	$(document).on('click', '.navbar-collapse form[role="search"].active button[type="submit"]', function(event) {
		event.preventDefault();
		var $form = $(this).closest('form'),
		$input = $form.find('input');
		$('#showSearchTerm').text($input.val());
		closeSearch()
	});
	
	
	// ______________Quantity-right-plus
	var quantitiy = 0;
	$('.quantity-right-plus').on('click', function(e) {
		e.preventDefault();
		var quantity = parseInt($('#quantity').val()); 
		$('#quantity').val(quantity + 1); 
	});
	$('.quantity-left-minus').on('click', function(e) {
		e.preventDefault();
		var quantity = parseInt($('#quantity').val());
		if (quantity > 0) {
			$('#quantity').val(quantity - 1);
		}
	});
	
	// ______________Full screen
	$("#fullscreen-button").on("click", function toggleFullScreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    })
	
	// ______________ mCustomScrollbar
	$(".highlight pre").mCustomScrollbar({
		theme:"minimal",
		autoHideScrollbar: true,
		scrollbarPosition: "outside"
	});
	$(".team").mCustomScrollbar({
		theme:"minimal",
		autoHideScrollbar: true,
		scrollbarPosition: "outside"
	});
	
	//Switcher
	$(document).on("click", "a[data-switcher]", function(e) {
		$("head link#switcher").attr("href", $(this).data("switcher"));
		$(this).toggleClass('active').siblings().removeClass('active');
	});
	
	/*Header Styles*/
	$(document).on('click', '#myonoffswitch', function(e){
		if (this.checked) {
			$('body').addClass('horizontal-conatiner');
			$('body').removeClass('default');
			localStorage.setItem("horizontal-conatiner", "True");
		}
		else {
			$('body').removeClass('horizontal-conatiner');
			localStorage.setItem("horizontal-conatiner", "false");
		}
	});
	
	/*Horizontal Styles*/
	$(document).on('click', '#myonoffswitch13', function(e){
		if (this.checked) {
			$('body').addClass('default-horizontal');
			$('body').removeClass('boxed');
			$('body').removeClass('default');
			localStorage.setItem("default-horizontal", "True");
		}
		else {
			$('body').removeClass('default-horizontal');
			localStorage.setItem("default-horizontal", "false");
		}
	});
	
	$(document).on('click', '#myonoffswitch14', function(e){
		if (this.checked) {
			$('body').addClass('boxed');
			$('body').removeClass('default-horizontal');
			$('body').removeClass('default');
			localStorage.setItem("boxed", "True");
		}
		else {
			$('body').removeClass('boxed');
			localStorage.setItem("boxed", "false");
		}
	});
	
	/*leftmenu-Iconic style*/
	$(document).on('click', '#myonoffswitch1', function(e){
		if (this.checked) {
			$('body').addClass('sidenav-toggled');
			$('body').removeClass('default');
			localStorage.setItem("sidenav-toggled", "True");
		}
		else {
			$('body').removeClass('sidenav-toggled');
			localStorage.setItem("sidenav-toggled", "false");
		}
	});
	
	/*leftmenu-Iconic style2*/
	$(document).on('click', '#myonoffswitch2', function(e){
		if (this.checked) {
			$('body').addClass('leftmenu-style-2');
			$('body').removeClass('leftmenu-light');
			$('body').removeClass('default');
			localStorage.setItem("leftmenu-style-2", "True");
		}
		else {
			$('body').removeClass('leftmenu-style-2');
			localStorage.setItem("leftmenu-style-2", "false");
		}
	});
	
	/*leftmenu-Iconic style2*/
	$(document).on('click', '#myonoffswitch3', function(e){
		if (this.checked) {
			$('body').addClass('header-dark');
			$('body').addClass('horizontalmenu-light');
			$('body').removeClass('default');
			$('body').removeClass('header-color');
			$('body').removeClass('horizontalmenu-dark');
			localStorage.setItem("header-dark", "True");
		}
		else {
			$('body').removeClass('header-dark');
			localStorage.setItem("header-dark", "false");
		}
	});
	
	/*leftmenu-Iconic style2*/
	$(document).on('click', '#myonoffswitch4', function(e){
		if (this.checked) {
			$('body').addClass('header-color');
			$('body').addClass('horizontalmenu-light');
			$('body').removeClass('default');
			$('body').removeClass('header-dark');
			$('body').removeClass('horizontalmenu-dark');
			localStorage.setItem("header-color", "True");
		}
		else {
			$('body').removeClass('header-color');
			localStorage.setItem("header-color", "false");
		}
	});
	
	/*leftmenu-Iconic style3*/
	$(document).on('click', '#myonoffswitch5', function(e){
		if (this.checked) {
			$('body').addClass('leftmenu-style-3');
			$('body').removeClass('leftmenu-style-4');
			$('body').removeClass('default');
			localStorage.setItem("leftmenu-style-3", "True");
		}
		else {
			$('body').removeClass('leftmenu-style-3');
			localStorage.setItem("leftmenu-style-3", "false");
		}
	});
	
	/*leftmenu-Iconic style4*/
	$(document).on('click', '#myonoffswitch8', function(e){
		if (this.checked) {
			$('body').addClass('leftmenu-style-4');
			$('body').removeClass('leftmenu-style-3');
			$('body').removeClass('default');
			localStorage.setItem("leftmenu-style-4", "True");
		}
		else {
			$('body').removeClass('leftmenu-style-4');
			localStorage.setItem("leftmenu-style-4", "false");
		}
	});
	
	
	/*leftmenu-Iconic style3*/
	$(document).on('click', '#myonoffswitch6', function(e){
		if (this.checked) {
			$('body').addClass('leftmenu-light');
			$('body').removeClass('default');
			$('body').removeClass('leftmenu-style-2');
			$('body').removeClass('leftmenu-style-3');
			localStorage.setItem("leftmenu-light", "True");
		}
		else {
			$('body').removeClass('leftmenu-light');
			localStorage.setItem("leftmenu-light", "false");
		}
	});

	/*Default theme*/
	$(document).on('click', '#myonoffswitch7', function(e){
		if (this.checked) {
			$('body').addClass('default');
			$('body').removeClass('default-horizontal');
			$('body').removeClass('boxed');
			$('body').removeClass('leftmenu-style-2');
			$('body').removeClass('leftmenu-light');
			$('body').removeClass('leftmenu-style-3');
			$('body').removeClass('leftmenu-style-4');
			$('body').removeClass('sidenav-toggled');
			$('body').removeClass('header-dark');
			$('body').removeClass('header-color');
			$('body').removeClass('leftmenu-icon-light');
			$('body').removeClass('leftmenu-icon-dark');
			$('body').removeClass('horizontalmenu-light');
			$('body').removeClass('horizontalmenu-dark');
			localStorage.setItem("default", "True");
		}
		else {
			$('body').removeClass('default');
			localStorage.setItem("default", "false");
		}
	});	
	
	/*Horizontalmenu-dark*/
	$(document).on('click', '#myonoffswitch9', function(e){
		if (this.checked) {
			$('body').addClass('horizontalmenu-dark');
			$('body').removeClass('header-dark');
			$('body').removeClass('header-color');
			$('body').removeClass('horizontalmenu-light');
			$('body').removeClass('default');
			localStorage.setItem("horizontalmenu-dark", "True");
		}
		else {
			$('body').removeClass('horizontalmenu-dark');
			localStorage.setItem("horizontalmenu-dark", "false");
		}
	});
	
	/*Horizontalmenu-light*/
	$(document).on('click', '#myonoffswitch10', function(e){
		if (this.checked) {
			$('body').addClass('horizontalmenu-light');
			$('body').removeClass('horizontalmenu-dark');
			$('body').removeClass('header-dark');
			$('body').removeClass('header-color');
			$('body').removeClass('default');
			localStorage.setItem("horizontalmenu-light", "True");
		}
		else {
			$('body').removeClass('horizontalmenu-light');
			localStorage.setItem("horizontalmenu-light", "false");
		}
	});
	
	
	/*Leftmenu-Icon-Dark*/
	$(document).on('click', '#myonoffswitch15', function(e){
		if (this.checked) {
			$('body').addClass('leftmenu-icon-dark');
			$('body').removeClass('leftmenu-icon-light');
			$('body').removeClass('default');
			localStorage.setItem("leftmenu-icon-dark", "True");
		}
		else {
			$('body').removeClass('leftmenu-icon-dark');
			localStorage.setItem("leftmenu-icon-dark", "false");
		}
	});
	
	/*Leftmenu-Icon-light*/
	$(document).on('click', '#myonoffswitch16', function(e){
		if (this.checked) {
			$('body').addClass('leftmenu-icon-light');
			$('body').removeClass('leftmenu-icon-dark');
			$('body').removeClass('default');
			localStorage.setItem("leftmenu-icon-light", "True");
		}
		else {
			$('body').removeClass('leftmenu-icon-light');
			localStorage.setItem("leftmenu-icon-light", "false");
		}
	});
	

	const DIV_CARD = 'div.card';
	// ______________Tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
	// ______________Popover
	$('[data-toggle="popover"]').popover({
		html: true
	});
	
	// ______________Card Remove
	$('[data-toggle="card-remove"]').on('click', function(e) {
		let $card = $(this).closest(DIV_CARD);
		$card.remove();
		e.preventDefault();
		return false;
	});
	
	// ______________Card Collapse
	$('[data-toggle="card-collapse"]').on('click', function(e) {
		let $card = $(this).closest(DIV_CARD);
		$card.toggleClass('card-collapsed');
		e.preventDefault();
		return false;
	});
	
	// ______________Card Full Screen
	$('[data-toggle="card-fullscreen"]').on('click', function(e) {
		let $card = $(this).closest(DIV_CARD);
		$card.toggleClass('card-fullscreen').removeClass('card-collapsed');
		e.preventDefault();
		return false;
	});
	
	
	// ______________Increment
	var quantitiy=0;
	$('.quantity-right-plus').on('click', function(e){
		e.preventDefault();
		var quantity = parseInt($('#quantity').val());
		$('#quantity').val(quantity + 1);

	});
	$('.quantity-left-minus').on('click', function(e){
		e.preventDefault();
		var quantity = parseInt($('#quantity').val());
		if(quantity>0){
			$('#quantity').val(quantity - 1);
		}
	});
	
//	//Date range as a button
//	$('#daterange-btn').daterangepicker({
//		ranges: {
//			'Today': [moment(), moment()],
//			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//			'This Month': [moment().startOf('month'), moment().endOf('month')],
//			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//		},
//		startDate: moment().subtract(29, 'days'),
//		endDate: moment()
//	}, function(start, end) {
//		$('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
//	})
	
	
})(jQuery);


