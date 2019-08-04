# brogit-captcha
Simple JS Proof of Work Captcha

Livedemo: http://developer.brogit.de/brogit-captcha/client.html

## How it works

The client is generating hashes with __key__+nonce which have leading zero's (__difficulty__). The start nonce is a random number.

These nonce's are sent back to the Server (__token__), which can fast check if they generate valid hashes with the __key__.
__hashes__ are the count how much Hashes should be generated.

## How to use

You only have to place a HTML-Element like this:

`<div class="brogit-captcha" data-difficulty="2" data-hashes="100" data-key="1234567890" data-callback="captchaCallback">Load Captcha...</div>`

Or via JavaScript (jQuery) like this:

`$('div.my-selector').brogit_captcha(difficulty, hashes, key, callback);`

-

And you have to write a _callback_ function, which is executed when the captcha is done.

The callback get the params:

`callback(token, key, difficulty, hashes, element);`

* __token__ _string_ Its a base64 concatenation of nonces, limiter is ';'
* __key__ _string_ The key which was used to generate valid hashes
* __difficulty__ _int_ The count of the leading zeros the valid hashes should have
* __hashes__ _int_ The count how much hashes should be generated
* __element__ _jQueryElement_ The element from which the callback is executed