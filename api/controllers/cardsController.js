    'use strict';
var _ = require('lodash');
var request = require("../manager/requestManager");

exports.booster = function(req, res){
	var idUser = req.params.idUser;
	var nbCartes = req.params.nbCartes;

	console.log("/cards/"+ idUser + "/booster/" + nbCartes);
	var idPokemons = [];
	var pokemons = [];
	var finalResult = {
		"idUser": idUser,
		"cards": []
	};

	for(let i=0; i<nbCartes; i++){
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
			for(let i=0; i < nbCartes; i++){
				var index = Math.floor(Math.random()*tmpCard.cards.length);
				var tmp = {
					"id": tmpCard.cards[index].id,
					"urlPicture": tmpCard.cards[index].imageUrl,
					"idPokemon": tmpCard.cards[index].nationalPokedexNumber,
					"price": 0
				}
				while(_.findIndex(finalResult.cards, tmp) != -1){
					index = Math.floor(Math.random()*tmpCard.cards.length);
					tmp = {
						"id": tmpCard.cards[index].id,
						"urlPicture": tmpCard.cards[index].imageUrl,
						"idPokemon": tmpCard.cards[index].nationalPokedexNumber,
						"price": 0
					}
				}
				finalResult.cards.push(tmp);
			}
		}
		return request.HTTP('127.0.0.1', '/user/addCard', "POST", finalResult);
	})
	.catch(function(error){
		res.end();
		console.log(error);
	})
	.then(function(response){
		res.json(finalResult);
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
				"urlPicture": card.imageUrl,
				"price": 0
			});
		});
		res.json(result);
	})
}
