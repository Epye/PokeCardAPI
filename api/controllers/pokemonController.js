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

	var options = "https://pokeapi.co/api/v2/pokemon/" + idPokemon + "/";
	var data = "";
	var request = https.get(options, (result) => {

		result.on('data', (d) => {
			data += d;
		});

		result.on('end', function() {
			var tmpData = JSON.parse(data);
			var resultData = {
				"id": tmpData.id,
				"name": tmpData.name,
				"weight": tmpData.weight,
				"height": tmpData.height,
				"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + idPokemon + ".png",
				"cards": []
			}	

			data = "";

			var request2 = https.get("https://api.pokemontcg.io/v1/cards?name=" + tmpData.name, (results) => {
				
				results.on('data', (d) => {
					data += d;
				});

				results.on('end', function() {
					var tmpCard = JSON.parse(data);
					tmpCard.cards.forEach(function(card){
						resultData.cards.push({
							"id": card.id,
							"urlPicture": card.imageUrlHiRes
						})
					})
					res.json(resultData);
				});

			});

			request2.on('error', (e) => {
				console.error(e);
			});

			request.end();
		});
	});

	request.on('error', (e) => {
		console.error(e);
	});

	request.end();
}