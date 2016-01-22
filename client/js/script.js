var blockTitleIndicator = {
	'open' : '&times;',
	'closed' : '+',
}

Meteor.startup( function () {
  $.getScript("js/jquery-2.1.4.min.js");
  $.getScript("js/bootstrap.min.js");
});

if (Meteor.isClient) {
	Template.layout.onRendered(function() {
		$('.project').on('click', function(e) {
			e.stopPropagation();
			var id = $(this).attr('id');
			$('#' + id).modal('show');
		});

		$('.contain-hidden').on('click', function(e) {
			var container = $(this),
				inner = $(this).find('.hidden-inner'),
				title = $(this).find('.block-title'),
				indicator = $(this).find('.block-title-indicator'),
				opened = false;
			if (inner.hasClass('clicked')) {
				opened = true;
			}

			if (opened) { // If clicked section is open, close it.
				container.removeClass('clicked');
				indicator.html(blockTitleIndicator['closed']); // Change indicator to '+'
				title.removeClass('underline'); // Remove title underline

				inner.addClass('fadeOutLeft');
				inner.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					inner.removeClass('clicked fadeInLeft');
					inner.off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
				});
			} else { // Section clicked on is not open
				$('.contain-hidden').each(function() { // Close all other sections
					var container = $(this),
						inner = $(this).find('.hidden-inner'),
						title = $(this).find('.block-title'),
						indicator = $(this).find('.block-title-indicator');
					if (inner.hasClass('clicked')) {
						container.removeClass('clicked');
						indicator.html(blockTitleIndicator['closed']); // Change indicator to '+'
						title.removeClass('underline'); // Remove title underline

						inner.addClass('fadeOutLeft');
						inner.removeClass('clicked fadeInLeft');
					}
				});

				// Open section
				container.addClass('clicked');
				indicator.html(blockTitleIndicator['open']); // Change indicator to '-'
				title.addClass('underline'); // Add title underline

				inner.removeClass('fadeOutLeft');
				inner.addClass('clicked fadeInLeft');
			}
		});
	});
}