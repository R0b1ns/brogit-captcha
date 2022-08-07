# brogit-captcha
Simple JS Proof of Work Captcha

+ for Bootstrap 5
+ Multilanguage support

Livedemo: http://developer.brogit.de/brogit-captcha/client.html

## Requirements

* jQuery >= 3.x
* Bootstrap >= 5.x
* sha256 >= 0.9.0

## How it works

The client generates hashes (sha256) with __key__+nonce that have leading zeros (__difficulty__). The starting nonce is a random number.

These nonces are sent to the server (__token__).
The server can quickly check if valid hashes were created with the __key__.
__hashes__ is the number of how many hashes should be generated.

The time limit for finding a hash is 60 seconds. If no hash is found within this time, the process is tried with a new random nonce.

## Getting started

```html
<script
	src="https://code.jquery.com/jquery-3.6.0.min.js"
	integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
	crossorigin="anonymous"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js"></script>
<script src="https://cdn.brogit.de/brogit-captcha/brogit.captcha.min.js" async></script>
```

## Usage

You just need to place a HTML-Element like this:

```html
<div class="brogit-captcha" data-difficulty="2" data-hashes="100" data-key="1234567890" data-callback="captchaCallback">Load Captcha...</div>
```

Or via JavaScript (jQuery) like this:

```javascript
$('div.my-selector').brogit_captcha(difficulty, hashes, key, callback);
```

___

A _callback_ function must be written which will be executed when the calculations are completed.

The callback function receives the following parameters:

```javascript
callback(token, key, difficulty, hashes, element);
````

* __token__ _string_ Its a base64 concatenation of nonces, limiter is ';'
* __key__ _string_ The key used to generate valid hashes
* __difficulty__ _int_ The number of leading zeros a hash must have to be valid
* __hashes__ _int_ The count how much hashes should be generated
* __element__ _jQueryElement_ The element from which the callback is executed

## Examples

Checkout the _master_ branch for a client/server example.

## Example Callback function

```javascript
function captchaCallback(token, key, difficulty, hashes, element) {
	client.xhr('post', 'server.php/captcha', {token: token}, function(resultdata, data, textStatus, jqXHR) {
		if(textStatus == 'success') {
			element.addClass('bg-success');
			$('form.captchaExample button[type="submit"]').attr('disabled', false);
		}
		else {
			element.addClass('bg-danger');
		}
	});
}
```

### Build via HTML-Template

```html
<div class="brogit-captcha" data-difficulty="{{difficulty}}" data-hashes="{{hashes}}" data-key="{{key}}" data-callback="captchaCallback">Load Captcha...</div>
```

### Build via AJAX-Request

```javascript
$(document).ready(function() {
	client.xhr('get', 'server.php/captcha', null, function(resultdata, data, textStatus, jqXHR) {
		if(resultdata.difficulty && resultdata.hashes && resultdata.key) {
			var captcha = $('<div>Load Captcha...</div>');

			captcha.brogit_captcha(resultdata.difficulty, resultdata.hashes, resultdata.key, captchaCallback);
		}
		else {
			var captcha = $("<div>Can't load Captcha...</div>");
		}

		$('form.captchaExample .form-captcha').append(captcha);
	});
});
```