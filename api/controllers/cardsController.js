'use strict';
var _ = require('lodash');
var request = require("../manager/requestManager");

exports.booster = function(req, res){
	var idUser = req.params.idUser;

	console.log("/cards/"+ idUser + "/booster");
	var idPokemons = [];
	var pokemons = [];
	var finalResult = {
		"idUser": idUser,
		"cards": []
	};

	for(let i=0; i<10; i++){
		idPokemons.push(Math.floor(Math.random()*802)+1);
	}

	var url = "https://api.pokemontcg.io";
	var path = "/v1/cards?nationalPokedexNumber=";

	idPokemons.forEach(function(id){
		path += id + "|";
	});
	
	request.HTTPS(url, path, "GET")
	.then(function(response){
		var tmpCard = response;
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
				pokemons.push(tmp.idPokemon);
			}
		}
		return request.HTTP('127.0.0.1', '/user/addCard', "POST", finalResult);
	})
	.catch(function(error){
		res.end();
		console.log(error);
	})
	.then(function(response){
		res.json(response);
	})
}

exports.cardsPokemon = function(req, res){
	var idPokemon = req.params.idPokemon;
	console.log("/cards/"+idPokemon);

	var url = "https://api.pokemontcg.io";
	var path = "/v1/cards?nationalPokedexNumber="+idPokemon;

	request.HTTPS(url, path, "GET")
	.then(function(response){
		var result = [];
		response.cards.forEach(function(card){
			result.push({
				"id": card.id,
				"idPokemon": card.nationalPokedexNumber,
				"urlPicture": card.imageUrl
			});
		});
		res.json(result);
	})
}
