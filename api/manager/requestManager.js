'use strict';
var https = require('https');
var http = require('http');
var mysql = require('mysql');

var HTTP = function(url, path, method, body){
	return new Promise(function(resolve, reject){
		if(body == undefined){
			body = {};
		}
		var data = "";

		var options = {
			port: 3000,
			hostname: url,
			method: method,
			path: path,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(JSON.stringify(body))
			}
		};

		var request = http.request(options, (results) => {
			results.on('data', (d) => {data += d;});
			results.on('end', function() {
				var tmpCard = JSON.parse(data);
				resolve(tmpCard);
			});
		});

		request.write(JSON.stringify(body));
		request.on('error', (e) => {console.error(e);});
		request.end();
	})
	.catch(function(error){
		console.log(error);
		return Promise.reject();
	})
}

var HTTPS = function(url, path, method, body){
	return new Promise(function(resolve, reject){
		if(body == undefined){
			body = {};
		}
		var data = "";

		var request = https.request(url+path, function(result){
			result.on('data', (d) => {data += d;});
			result.on('end', function() {
				resolve(JSON.parse(data));
			});
		});
		request.on('error', (e) => {console.error(e);});
		request.end();
	})
	.catch(function(error){
		console.log(error);
		return Promise.reject();
	})
}

module.exports = {
	HTTPS: HTTPS,
	HTTP: HTTP
}