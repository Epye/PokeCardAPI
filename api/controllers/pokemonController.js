'use strict';
var https = require('https');

exports.pokedex = function(req, res) {

	var options = "https://pokeapi.co/api/v2/pokedex/1/";

	var data = "";

	var request = https.get(options, (result) => {
		result.on('data', (d) => {
			data += d;
		});
		result.on('end', function() {
			res.json(JSON.parse(data));
		});
	});

	request.on('error', (e) => {
		console.error(e);
	});

	request.end();
}