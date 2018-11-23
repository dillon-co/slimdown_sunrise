// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require popper
//= require bootstrap-sprockets
//= require_tree .


var r = {
	state: {
		autoscroll: false
	}
};
$(function () {
	imgLazy()
});
$('body').on('click', '.j_scroll', function (e) {
	e.preventDefault();
	r.state.autoscroll = true;
	var href = $(this).attr('href');
	$('html, body').animate({
		scrollTop: $(href).offset().top
	}, 600, function () {
		imgLazy();
		r.state.autoscroll = false
	})
});
$(window).on('scroll resize orientationchange', function () {
	if (!r.state.autoscroll) {
		imgLazy()
	}
});
$('body').on('click', '[data-valfill-target]', function (e) {
	e.preventDefault();
	var t = $(this),
		target = t.data('valfill-target'),
		value = t.data('valfill-value'),
		group = t.data('valfill-group');
	if (!target || !value) {
		return false
	}
	target = target.toString().split(',');
	value = value.toString().split(',');
	group = group ? group.toString().split(',') : false;
	for (var i = 0; i < target.length; i += 1) {
		if ($(target[i]).is('input, select, textarea')) {
			$(target[i]).val(value[i])
		} else {
			$(target[i]).html(value[i])
		}
		if (group[i]) {
			$(group[i] + '.active').removeClass('active')
		}
	}
	if (group) {
		t.addClass('active')
	}
});
$('body').on('click change', '[data-active-target]', function (e) {
	var $t = $(this);
	if (!$t.is(':checkbox')) {
		e.preventDefault()
	}
	if ($t.is('select') && e.type != 'change') {
		return
	}
	var group = $t.data('active-group'),
		kids = $t.data('active-kids'),
		target = $t.data('active-target'),
		$scroll = $($t.data('active-scroll')),
		activate = true;
	if (!group || !kids || !target) {
		return false
	}
	group = group.toString().split(',');
	kids = kids.toString().split(',');
	target = target.toString().split(',');
	for (var i = 0; i < target.length; i += 1) {
		var $group = $(group[i]),
			$kids = $(kids[i], $group);
		if (!$group.length || !$kids.length) {
			continue
		}
		if ($t.is('select')) {
			var $target = $(target[i], $group).filter('[data-active-is-target="' + $t.val() + '"]')
		} else {
			var $target = $(target[i], $group)
		}
		if ($t.is(':checkbox')) {
			activate = $t.is(':checked');
		} else if (!$target.length || $target.hasClass('active')) {
			continue
		}
		if (activate) {
			$kids.removeClass('active');
			$target.addClass('active')
		} else {
			$target.removeClass('active')
		}
	}
	if ($scroll.length && $(window).width() <= 767) {
		$('html, body').animate({
			scrollTop: $scroll.offset().top
		}, 600)
	}
});
$('body').on('click change', '[data-reveal]', function (e) {
	if (!$(this).is(':radio')) {
		e.preventDefault();
	} else if (e.type == 'click') {
		return
	}
	var target = $($(this).data('reveal')),
		type = $(this).data('reveal-type') || false;
	if (!target.length) {
		return false
	}
	if (target.hasClass('is-revealed')) {
		if (type != 'show') {
			target.removeClass('is-revealed')
		}
	} else if (type != 'hide') {
		target.addClass('is-revealed')
	}
});
$('body').on('click', '[data-submit]', function (e) {
	e.preventDefault();
	var $form = $($(this).data('submit'));
	if ($form.length) {
		$form.submit()
	}
});
$('body').on('submit', 'form', function (e) {
	var form = $(this),
		errfields = [],
		goodfields = [],
		addmess = "";
	$('#ajaxloader').show(1);
	$('input[type=submit]', form).prop('disabled', true);
	$('.required', form).each(function () {
		var field = $(this),
			val = $.trim(field.val()),
			error = false;
		if (val == '') {
			error = true
		} else if (field.hasClass('email') && !val.match(/^[_A-z0-9-]+((\.|\+)[_A-z0-9-]+)*@[A-z0-9-]+(\.[A-z0-9-]+)*(\.[A-z]{2,10})$/)) {
			error = true
		} else if (field.hasClass('phone')) {
			ph = val.replace(/[^0-9]/g, '');
			if (ph.length < 10) {
				error = true
			}
		} else if (field.is('input:checkbox') && !field.is(':checked')) {
			error = true
		} else if (field.is('input:radio') && !field.is(':checked')) {
			error = true;
			$('input[type=radio][name=' + field.attr('name') + ']', form).each(function () {
				if ($(this) == field) {
					return true
				}
				if ($(this).is(':checked')) {
					return error = false
				}
			})
		}
		if (error) {
			errfields.push(field)
		} else {
			goodfields.push(field)
		}
	});
	if (goodfields.length > 0) {
		for (i = 0; i <= goodfields.length - 1; i += 1) {
			$(goodfields[i]).add($(goodfields[i]).parents('.row')).removeClass('error')
		}
	}
	if (errfields.length > 0) {
		for (i = 0; i <= errfields.length - 1; i += 1) {
			$(errfields[i]).add($(errfields[i]).parents('.row')).addClass('error')
		}
		var mess = 'Please make sure you have filled in all fields, and try again. Missing fields are highlighted.';
		mess = addmess ? mess + "\n\n" + addmess : mess;
		$('input[type=submit]', form).prop('disabled', false);
		$('#ajaxloader').hide(1);
		alert(mess)
	} else {
		var $upsell = $(form.data('formup-olay')),
			trigger = form.data('formup-trigger');
		if ($upsell.length && trigger && !$('[name=up-view]').val()) {
			trigger = trigger.split('=');
			var triggerActual = $('[name=' + trigger[0] + ']', form).val();
			if (triggerActual && trigger[1] && in_array(triggerActual, trigger[1].split('|'))) {
				$('[data-' + trigger[0] + '=' + triggerActual + ']', $upsell).show(1);
				$('#ajaxloader').hide(1);
				olay($upsell);
				return false
			}
		}
		if (form.hasClass('j_ajx')) {
			soap_formajx(form);
			return false
		}
		return true
	}
	return false
});

function soap_formajx(form) {
	$('#ajaxloader').show(1);
	$.ajax({
		type: 'POST',
		url: baseurl + '/ajax/form.php',
		data: form.serialize(),
		success: function (r) {
			$('#ajaxloader').hide(1);
			r = $.parseJSON(r);
			if (r.redirect) {
				window.location.href = r.redirect
			} else if (r.error) {
				alert(r.message)
			} else if (!r.success) {
				alert('Please make sure that you\'ve filled in all fields, and resubmit. Missing fields are highlighted.')
			} else {
				if (r.message) {
					alert(r.message)
				}
				form.find('input[type=text], input[type=email], input[type=tel], select, textarea').val('')
			}
			$('input[type=submit]', form).prop('disabled', false);
			$('#ajaxloader').hide(1)
		}
	})
}

function olay(olay) {
	if (!olay.length) {
		return false
	}
	$('body').addClass('has-olay');
	olay.fadeIn(200, function () {
		setTimeout(function () {
			imgLazy()
		}, 1000)
	})
}

function imgLazy() {
	$('img[data-src]').each(function () {
		if (isInView($(this)) && !$(this).hasClass('visible')) {
			$(this).smartBackgroundImage($(this).data('src')).addClass('visible')
		}
	})
}
$.fn.smartBackgroundImage = function (url, keephidden) {
	var t = this;
	keephidden = keephidden ? keephidden : false;
	$(this).css({
		'opacity': 0
	});
	var img = new Image();
	img.onload = function () {
		var w = this.width,
			h = this.height;
		t.css({
			width: w,
			height: h,
			'background-image': 'url(' + url + ')'
		});
		if (!keephidden) {
			t.animate({
				opacity: 1
			}, 600)
		}
	};
	img.src = url;
	return this
};

function isInView(e, offset) {
	offset = offset ? offset : 0;
	var docViewTop = $(window).scrollTop(),
		docViewBottom = docViewTop + $(window).height(),
		elemTop = $(e).offset().top + offset,
		elemBottom = elemTop + $(e).height() - offset - offset;
	return ((docViewBottom >= elemTop) && (docViewTop <= elemBottom))
}
var countdown = function () {
		var time = 6e3,
			target, inter;
		var start = function (selector) {
			target = $(selector);
			if (!target.length) {
				return
			}
			inter = setInterval(function () {
				var m = Math.floor(time / 600),
					s = Math.floor(time / 10 % 60);
				target.text(fill(m) + ':' + fill(s) + '.0' + Math.floor(time % 10));
				time -= 1;
				if (time === -1) {
					clearInterval(inter)
				}
			}, 100)
		};
		var fill = function (number) {
			return number < 10 ? '0' + number : number
		};
		return {
			start: function (selector) {
				start(selector)
			}
		}
	}
	();
countdown.start('.j_countdown');
var slideshow = function () {
		var target = $('.j_slideshow'),
			stage = $('.slide-stage', target),
			slideClass = '.slide',
			delay = 5000,
			is_running = false,
			$interval;
		var init = function () {
			if (!target.length || !stage.length) {
				return
			}
			start()
		};
		var start = function () {
			if (is_running) {
				return
			}
			is_running = true;
			$interval = window.setInterval(slide, delay)
		};
		var stop = function () {
			is_running = false;
			window.clearInterval($interval)
		};
		var slide = function () {
			var current = $(slideClass + '.active', stage);
			if (!current.length) {
				return stop()
			}
			var next = current.next(slideClass);
			if (!next.length) {
				next = $(slideClass, stage).first()
			}
			var position = next.position();
			stage.animate({
				left: -position.left
			}, 200, function () {
				current.removeClass('active');
				next.addClass('active')
			})
		};
		return {
			init: function () {
				init()
			}
		}
	}
	();
slideshow.init();

function in_array(needle, hay) {
	for (i = 0; i <= hay.length - 1; i += 1) {
		if (needle == hay[i]) {
			return true
		}
	}
	return false
}
