'use strict';
var https = require('https');

exports.pokedex = function(req, res) {

	console.log("/pokedex")

	var options = "https://pokeapi.co/api/v2/pokemon/?limit=802&offset=0";

	var data = "";

	var request = https.get(options, (result) => {

		result.on('data', (d) => {
			data += d;
		});

		result.on('end', function() {
			var tmpData = JSON.parse(data);

			var finalResult = {"pokedex": []};

			for(var i=1; i<=802; i++){
				finalResult.pokedex.push({
					"id": i,
					"name": tmpData.results[i-1].name,
					"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + i + ".png"
				});
			}
			res.json(finalResult);
		});

	});

	request.on('error', (e) => {
		console.error(e);
	});

	request.end();
}

exports.pokemonDetails = function(req, res){

	var idPokemon = req.params.idPokemon;

	console.log("/pokemon/" + idPokemon);

	var options = "https://pokeapi.co/api/v2/pokemon/?limit=802&offset=0";
	var data = "";
	var request = https.get(options, (result) => {

		result.on('data', (d) => {
			data += d;
		});

		result.on('end', function() {
			console.log(data)
			var tmpData = JSON.parse(data);

			//var finalResult = {"pokedex": []};

			/*for(var i=1; i<=802; i++){
				finalResult.pokedex.push({
					"id": i,
					"name": tmpData.results[i-1].name,
					"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + i + ".png"
				});
			}*/
			res.json(tmpData);
		});

	});

	request.on('error', (e) => {
		console.error(e);
	});

	request.end();
}