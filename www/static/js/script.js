$(document).ready(function() {
  $(".nav-menu").on("click", function() {
    var id = "#" + $(this).html().trim().toLowerCase();
    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 500);
  });
});

$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
    });
}
