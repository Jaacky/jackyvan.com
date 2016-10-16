$(document).ready(function() {
    /*
        Nav menu scrolling
    */
    $(".nav-menu").on("click", function() {
        var id = "#" + $(this).html().trim().toLowerCase();
        $(".nav-menu").removeClass("active");
        $(this).addClass("active");
        console.log($(this));
        $('html, body').animate({
            scrollTop: $(id).offset().top
        }, 500);
    });

    /*
        Updating nav menu when scrolling
        https://jsfiddle.net/cse_tushar/Dxtyu/141/
    */
    $(document).on("scroll", function() {
        var scrollPos = $(document).scrollTop();
        $('.nav-menu').each(function () {
            var currLink = $(this);
            var refElement = $("#" + currLink.html().trim().toLowerCase());
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.nav-menu').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    });
});
