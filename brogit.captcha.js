/*!
  * brogit captcha v1.22.8 (https://brogit.de/)
  * 2022 Copyright (c) brogit
  * Requirements: jQuery 3.x, Bootstrap 5.x, sha256.min.js
  */

var brogit_captcha_locale = {
	'en-US': 'Verify me',
	'de-DE': 'Verifiziere mich',
}

/**
 * Generic jQuery extension
 */
$.fn.extend({
	brogit_captcha: function(difficulty, hashes, key, callback) {
		if($(this).hasClass('brogit-captcha') && $(this).hasClass('prepared')) {
			return this;
		}

		$(this).addClass('brogit-captcha');

		var difficulty = difficulty || $(this).attr('data-difficulty');
		var hashes = hashes || $(this).attr('data-hashes');
		var key = key || $(this).attr('data-key');
		var callback = callback || window[$(this).attr('data-callback')];

		if(!(difficulty && hashes && key && callback)) {
			return this;
		}

		$(this).attr('data-hashes', hashes);
		$(this).attr('data-key', key);
		$(this).attr('data-callback', callback.name);

		var text_verify = brogit_captcha_locale['en-US'];

		var language = navigator.language || navigator.userLanguage;

		if(language in brogit_captcha_locale) {
			text_verify = brogit_captcha_locale[language];
		}
		// search for first language code bracket
		else {
			var language_bracket = language.split('-')[0];
			var result = Object.keys(brogit_captcha_locale).find(function(a) { return a.split('-')[0] == language_bracket });

			if(result) {
				text_verify = brogit_captcha_locale[result];
			}
		}

		var proof_it = function(element) {
			var nonces = [];
			//pseudo random start nonce
			var nonce = Math.round(Math.random() * 1000000);

			var progress = 0;

			var nIntervId = setInterval(function() {

				//
				var result = proof_of_work(difficulty, key, nonce);
				if(result) {
					nonce = result[1];
					nonces.push(nonce);
					nonce++;

					progress += 1 / hashes;
				}

				var percentage = Math.round(progress * 100);

				element.width(percentage+"%");

				if(percentage >= 100) {
					clearInterval(nIntervId);

					//callback with token
					var token = btoa(nonces.join(';'));

					if (typeof callback === 'function') {
						callback(token, key, difficulty, hashes, element);
						element.addClass('bg-success');
					}
				}
			}, 1000 / 60);
		};

		var uid = Math.round(Math.random() * 1000000);
		var button = $('<div class="form-check me-sm-2"><input class="form-check-input" type="checkbox" id="brogit-captcha-button-'+uid+'"><label class="form-check-label" for="brogit-captcha-button-'+uid+'">'+text_verify+'</label></div>');

		button.one('click', function() {
			var progressbar = $('<div class="progress" style="display:none;"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>');
			$(this).parent().append(progressbar);

			$(this).fadeOut(null, function() {
				progressbar.fadeIn(null, function() {
					proof_it($(this).find('.progress-bar'));
				});
			});
		});

		$(this).html(button);
		$(this).addClass('prepared');

		return this;
	}
});

function proof_of_work(difficulty, key, nonce, timelimit) {
	//Timelimit to solve are 60sec
	timelimit = timelimit || 60000;

	var leading_zeros = '';
	leading_zeros = leading_zeros.padStart(difficulty, '0');

	var nonce = nonce || 0;

	var timelimit = Date.now() + timelimit;

	while(Date.now() < timelimit) {
		var hash = sha256(key+nonce);

		if(hash.startsWith(leading_zeros)) {
			return [hash, nonce];
		}

		nonce++;
	}
	console.error("Cant solve Hash in accteptable Time");
	return false;
}

$(window).on('load',function() {
	$('.brogit-captcha').each(function() {
		$(this).brogit_captcha();
	});
});