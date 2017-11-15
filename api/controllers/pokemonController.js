'use strict';
var _ = require('lodash');
var https = require('https');
var http = require('http');

exports.pokedex = function(req, res) {

	console.log("/pokedex")

	var options = "https://pokeapi.co/api/v2/pokemon/?limit=802";

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
				"weight": tmpData.weight/10,
				"height": tmpData.height/10,
				"type": "",
				"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + idPokemon + ".png",
				"cards": []
			}	

			tmpData.types.forEach(function(type){
				resultData.type += type.type.name + " ";
			});

			data = "";

			var request2 = https.get("https://api.pokemontcg.io/v1/cards?name=" + tmpData.name, (results2) => {
				
				results2.on('data', (d) => {
					data += d;
				});

				results2.on('end', function() {
					var tmpCard = JSON.parse(data);
					tmpCard.cards.forEach(function(card){
						resultData.cards.push({
							"id": card.id,
							"urlPicture": card.imageUrl
						})
					});
					res.json(resultData);
				});

			});

			request2.on('error', (e) => {
				console.error(e);
			});

			request2.end();
		});
	});

	request.on('error', (e) => {
		console.error(e);
	});

	request.end();
}

exports.booster = function(req, res){
	var idUser = req.params.idUser;

	console.log("/"+ idUser + "/booster");
	var idPokemons = [];
	var finalResult = {
		"idUser": idUser,
		"cards": []
	};

	for(let i=0; i<10; i++){
		idPokemons.push(Math.floor(Math.random()*802)+1);
	}

	var options = "https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=";

	idPokemons.forEach(function(id){
		options += id + "|";
	});
	
	var data = "";

	var requestCards = https.get(options, (resultsCards) => {

		resultsCards.on('data', (d) => {
			data += d;
		});

		resultsCards.on('end', function() {
			var tmpCard = JSON.parse(data);
			if(tmpCard.cards.length > 0){
				for(let i=0; i < 10; i++){
					var index = Math.floor(Math.random()*tmpCard.cards.length);
					finalResult.cards.push({
						"id": tmpCard.cards[index].id,
						"idPokemon": tmpCard.cards[index].nationalPokedexNumber
					});
				}
			}

			data = "";

			options = {
				port: 3000,
				hostname: '127.0.0.1',
				method: 'POST',
				path: '/user/addCard',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(JSON.stringify(finalResult))
				}
			};

			var requestAddCards = http.request(options, (resultsAddCards) => {

				resultsAddCards.on('data', (d) => {
					data += d;
				});

				resultsAddCards.on('end', function() {
					var tmpCard = JSON.parse(data);

					res.json(tmpCard);
				});

			});

			requestAddCards.write(JSON.stringify(finalResult));

			requestAddCards.on('error', (e) => {
				console.error(e);
			});

			requestAddCards.end();
		});

	});

	requestCards.on('error', (e) => {
		console.error(e);
	});

	requestCards.end();
}