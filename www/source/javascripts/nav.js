// Nav Scripts
const $navLinks = $('.main-nav--links');
const $navToggle = $('.main-nav--toggle');
const navBreakpoint = 730; // this should match $nav-breakpoint in _nav.scss
const $mainContent = $('#main-content');
const $mainNav = $('#main-nav');
const $mainNavCtas = $('#main-nav-ctas');
const currentPagePath = location.pathname;
const navPageLinks = ['about', 'docs', 'tutorials', 'community'];

$navToggle.click(function() {
  $(this).toggleClass('turn');
  $navLinks.slideToggle(100);
});

$(window).resize(function() {
  if ($(window).width() >= navBreakpoint) {
    $navToggle.removeClass('is-active');
    $navLinks.attr("style", "");
  }
});

//Sub Mobile Nav for docs

$(document).ready(function() {
  //Hide links for docs
  $('li.main-nav--link.docs--inside--link').hide();
});

$('span.toggle').click(function() {
  $(this).toggleClass('turn');
  //hide links that are not docs
  $('.docs').toggleClass('t-blue');
  $('.hide-docs').toggleClass('hide');
  $('li.main-nav--link.docs--inside--link').slideToggle(100);
});

// toggles fixed nav position when the window is too short
var footerOffsetTop, navOffsetBottom;

function toggleFixedNavPosition() {
  navOffsetBottom = $mainNav.outerHeight() + $(window).scrollTop();
  footerOffsetTop = $("#main-footer").offset().top;

  $mainNav.toggleClass("is-fixed-bottom", (footerOffsetTop < navOffsetBottom) && $(window).height() <= 759)
}

$(document).ready(function() {
  $mainContent.css('min-height', $mainNav.outerHeight() - $('#main-nav-ctas').outerHeight());
  toggleFixedNavPosition();
});

$(window).scroll(function() {
  toggleFixedNavPosition();
});

///Logic to add color to actie page link --Not working WIP - Hannah
//for (var linkName in navPageLinks) {
//  var linkNamePath = navPageLinks[linkName],
//      currentPagePath = currentPagePath.split('/')[1];
//  if (currentPagePath == linkNamePath) {
//    $('#main-nav-ctas a' + navPageLinks[linkName]).addClass('t-purple');
//  }
//};



// handle nav when global message exists
// gm_session_id is set on at template level
var globalMessageHeight;
const $globalMessage = $("#global-message");

function adjustNavPosition() {
  globalMessageHeight = $globalMessage.outerHeight();

  if ($globalMessage.is(":visible")) {
    $mainNav.css('top', globalMessageHeight);
    $mainNavCtas.css('top', globalMessageHeight);
    $mainContent.css('margin-top', globalMessageHeight + 80);
  }
}

if(!localStorage.getItem(gm_session_id)) {
  $globalMessage.addClass('is-visible');
  adjustNavPosition();
}

$(document).ready(function() {
  $("#global-message .dismiss-button").click(function(e) {
    $globalMessage.removeClass('is-visible')
    $mainNav.css('top', '');
    $mainNavCtas.css('top', '');
    $mainContent.css('margin-top', 80);
    localStorage.setItem(gm_session_id, "true");
    return false;
  });
});

$(window).resize(function() {
  if(!localStorage.getItem(gm_session_id)) {
    adjustNavPosition();
  }
});
