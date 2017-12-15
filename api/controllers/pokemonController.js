'use strict';
var _ = require('lodash');
var request = require('../manager/requestManager');

exports.pokedex = function(req, res) {

	console.log("/pokedex");

	var url = "https://pokeapi.co";
	var path = "/api/v2/pokemon/?limit=802";

	request.HTTPS(url, path, "GET")
	.then(function(response){
		var finalResult = [];

		for(var i=1; i<=802; i++){
			finalResult.push({
				"id": i,
				"name": response.results[i-1].name,
				"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + i + ".png"
			});
		}
		res.json(finalResult);
	})
	.catch(function(error){
		res.sendStatus(500);
	})
}

exports.pokemonDetails = function(req, res){

	var idPokemon = req.params.idPokemon;

	console.log("/pokemon/" + idPokemon);

	var resultData = {};

	var url = "https://pokeapi.co";
	var path = "/api/v2/pokemon/" + idPokemon + "/";

	request.HTTPS(url, path, "GET")
	.then(function(response){
		resultData = {
			"id": response.id,
			"name": response.name,
			"weight": response.weight/10,
			"height": response.height/10,
			"type": "",
			"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + idPokemon + ".png",
			"cards": []
		}	

		response.types.forEach(function(type){
			resultData.type += type.type.name + " ";
		});

		url = "https://api.pokemontcg.io";
		path = "/v1/cards?name=" + response.name;

		return request.HTTPS(url, path, "GET");
	})
	.catch(function(error){
		res.sendStatus(500);
	})
	.then(function(response){
		response.cards.forEach(function(card){
			resultData.cards.push({
				"id": card.id,
				"urlPicture": card.imageUrl,
				"price": price(card.rarity)
			})
		});
		res.json(resultData);
	})
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

