$(document).ready(function() {
    /*
        Nav menu scrolling
    */
    $(".nav-navigate-within").on("click", function() {
        var id = "#" + $(this).html().trim().toLowerCase();
        $(".nav-menu").removeClass("active");
        $(this).addClass("active");
        console.log($(this));
        $('html, body').animate({
            scrollTop: $(id).offset().top - 110
        }, 500);
    });

    $('.next-arrow').on('click', function() {
        var next = "#" + $(this).data("nextSection");
        $('html, body').animate({
            scrollTop: $(next).offset().top - 110
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
        var scrollPos = $(document).scrollTop() + 400;
        $('.nav-navigate-within').each(function () {
            var currLink = $(this);
            var refElement = $("#" + currLink.html().trim().toLowerCase());

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

    /* Match height on all .project divs */
    // $(function() {
    //     $('.project-inner').matchHeight({ byRow: false });
    // });

    $('.projects-container').masonry({
        itemSelector: '.project',
        columnWidth: '.col-md-4'
    })
});