'use strict';
var _ = require('lodash');
var https = require('https');
var http = require('http');

exports.booster = function(req, res){
	var idUser = req.params.idUser;

	console.log("/cards/"+ idUser + "/booster");
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
					var tmp = {
						"id": tmpCard.cards[index].id,
						"idPokemon": tmpCard.cards[index].nationalPokedexNumber
					}
					while(_.findIndex(finalResult.cards, tmp) != -1){
						index = Math.floor(Math.random()*tmpCard.cards.length);
						tmp = {
							"id": tmpCard.cards[index].id,
							"idPokemon": tmpCard.cards[index].nationalPokedexNumber
						}
					}
					finalResult.cards.push(tmp);
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

exports.cardsPokemon = function(req, res){
	var idPokemon = req.params.idPokemon;
	console.log("/cards/"+idPokemon);

	var options = "https://api.pokemontcg.io/v1/cards?nationalPokedexNumber="+idPokemon;
	
	var data = "";

	var requestCards = https.get(options, (resultsCards) => {

		resultsCards.on('data', (d) => {
			data += d;
		});

		resultsCards.on('end', function() {
			var tmpCard = JSON.parse(data);
			var result = [];
			tmpCard.cards.forEach(function(card){
				result.push({
					"id": card.id,
					"idPokemon": card.nationalPokedexNumber,
					"urlPicture": card.imageUrl
				});
			});
			res.json(result);
		});
	});

	requestCards.on('error', (e) => {
		console.error(e);
	});

	requestCards.end();
}
