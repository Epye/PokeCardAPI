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

			var finalResult = [];

			for(var i=1; i<=802; i++){
				finalResult.push({
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
							"urlPicture": card.imageUrl,
							"price": price(card.rarity)
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

var price = function(rarity){
	if(rarity == "Common"){
		return 100;
	}else if (rarity == "Uncommon"){
		return 150;
	}else if (rarity == "Rare"){
		return 200;
	}else if (rarity == "Rare Holo"){
		return 250;
	}else if (rarity == "Rare Ultra"){
		return 300;
	}else if (rarity == "Rare Holo EX"){
		return 500;
	}else if (rarity == "Rare Holo Lv.X"){
		return 500;
	}else{
		return 400;
	}
}