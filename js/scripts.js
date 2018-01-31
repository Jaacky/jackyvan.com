$(document).ready(function() {
    $('#nav-mobile-menu').on('click', function() {
        var nav_menu = $('.nav-menu-items');
        if ($(this).hasClass('open')) { // Close menu action
            $(this).removeClass('open');
            $(".nav").removeClass('open');
            // nav_menu.addClass('animated slideOutUp');
            // nav_menu.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
            //     function(e) {
            //         nav_menu.removeClass('open animated slideOutUp');
            //         $('.nav-dropdown, .dropdown').removeClass('active'); // Close any subnav dropdowns open
            //     });
        } else { // Open menu action
            $(this).addClass('open');
            $(".nav").addClass('open');
            // nav_menu.addClass('open animated slideInDown');
            // nav_menu.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
            //     function(e) {
            //         nav_menu.removeClass('animated slideInDown');
            //     });
        }
    });

    $('.next-arrow').on('click', function() {
        $('html, body').animate({
            scrollTop: $('#experiences').offset().top - $('.nav').outerHeight()
        }, 500);
    });

    /*
        Nav menu scrolling
    */
    $(".nav-navigate-within").on("click", function() {
        var id = "#" + $(this).data("navTo");
        $(".nav-menu").removeClass("active");
        $(this).addClass("active");
        $('html, body').animate({
            scrollTop: $(id).offset().top - $('.nav').outerHeight()
        }, 500);
    });

    /*
        Updating nav menu when scrolling
        https://jsfiddle.net/cse_tushar/Dxtyu/141/
    */
    $(document).on("scroll", function() {
        var currPos = $(document).scrollTop();
        if (currPos > 50) {
            $('.nav').addClass('active');
        } else {
            $('.nav').removeClass('active');
        }
        var scrollPos = $(document).scrollTop() + 350;
        $('.nav-navigate-within').each(function () {
            var currLink = $(this);
            var refElement = $("#" + currLink.data("navTo"));

            /*
                Useful debugging statements for tweaking scrolling -Jacky
            */
            // console.log(
            //     "Ref top: " + refElement.position().top + 
            //     ", ref top + height: " + String(refElement.position().top + refElement.outerHeight()) + 
            //     ", scroll pos: " + scrollPos, $(this));
            // console.log(
            //     "If condition: " + String(refElement.position().top <= scrollPos && refElement.position().top + refElement.outerHeight() >= scrollPos) +
            //     ", first part of if: " + String(refElement.position().top <= scrollPos) + 
            //     ", second part of it: " + String(refElement.position().top + refElement.outerHeight() >= scrollPos));

            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.outerHeight() >= scrollPos) {
                $('.nav-menu').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    });
});