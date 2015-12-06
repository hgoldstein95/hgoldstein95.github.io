$(document).ready(function() {
  $(".button-collapse").sideNav({
    edge: 'right'
  });
  $('.slider').slider({
    full_width: true
  });
  $('.tooltipped').tooltip({
    delay: 10
  });
  $("#side-nav").pushpin({
    offset: 110
  });
  $('a[href*=#].item').click(function() {
    $(this).addClass('active');
    setTimeout(function() {
      $('.active').removeClass('active');
    }, 1500);
  });
  $('a[href*=#]:not([href=#]):not(.c-tab)').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 75
        }, 1000);
        return false;
      }
    }
  });
});
