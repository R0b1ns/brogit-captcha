<?php

function proof_the_work($token, $difficulty, $hashes, $key) {
	$nonces = explode(';', base64_decode($token));

	if(count($nonces) != $hashes) {
		//Error Sum mismatch
		return false;
	}

	$leading_zeros = str_pad('', $difficulty, '0');

	foreach ($nonces as $nonce) {
		$hash = hash('sha256', $key.$nonce);
		if(stripos($hash, $leading_zeros) !== 0) {
			//Error hash not valid
			return false;
		}
	}

	return true;
}

$path_info = strtolower($_SERVER['PATH_INFO']);
$method = strtolower($_SERVER['REQUEST_METHOD']);

$response = new \stdClass();

session_start();

if($path_info == '/captcha') {
	switch ($method) {
		case 'get':
			
			//Generate some pseudo random key, and set hashes
			$difficulty = 4;
			$hashes = 16;
			$key = bin2hex(random_bytes(42));

			$response->{'difficulty'} = $difficulty;
			$response->{'hashes'} = $hashes;
			$response->{'key'} = $key;

			//Save it to your session -- or to your database.
			$_SESSION['captcha'] = [
				'difficulty'=> $difficulty,
				'hashes' 	=> $hashes,
				'key' 		=> $key,
				'expire'	=> time() + 300	//5min
			];

			break;

		case 'post':
			if(!isset(
				$_POST['token'],
				$_SESSION['captcha'],
				$_SESSION['captcha']['difficulty'],
				$_SESSION['captcha']['hashes'],
				$_SESSION['captcha']['key'],
				$_SESSION['captcha']['expire'])
			) {
				$response->{'error'} = 'Params not set';
				break;
			}

			if(time() > $_SESSION['captcha']['expire']) {
				$response->{'error'} = 'Time Expired';
				break;
			}

			$token = $_POST['token'];

			$difficulty = $_SESSION['captcha']['difficulty'];
			$hashes = $_SESSION['captcha']['hashes'];
			$key = $_SESSION['captcha']['key'];

			$response->{'status'} = proof_the_work($token, $difficulty, $hashes, $key) ? 'success' : 'failed';

			break;
		
		default:
			# code...
			break;
	}
}

header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

print json_encode($response);

?>