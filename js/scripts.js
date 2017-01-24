$(document).ready(function() {
    $('.next-arrow').on('click', function() {
        $('html, body').animate({
            scrollTop: $('#experience').offset().top
        }, 500);
    });
});