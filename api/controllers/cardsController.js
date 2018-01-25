'use strict';
var _ = require('lodash');
var mysql = require('mysql');
var request = require("../manager/requestManager");

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

connection.connect();

exports.booster = function(req, res){
	var idUser = req.params.idUser;
	var nbCartes = req.params.nbCartes;

	console.log("/cards/"+ idUser + "/booster/" + nbCartes);
	var idPokemons = [];
	var idCards = [];
	var nbPokemon = 0;
	var finalResult = {
		"idUser": idUser,
		"cards": []
	};

	if(nbCartes < 20){
		nbPokemon = 20;
	}else{
		nbPokemon = nbCartes;
	}

	for(let i=0; i<20; i++){
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
				idCards.push(tmp.id);
				finalResult.cards.push(tmp);
			}
		}
		var tmp = {
			"idUser": finalResult.idUser,
			"cards": idCards
		}
		return request.HTTP('127.0.0.1', '/user/addCard', "POST", tmp);
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

exports.getBoosters = function(req, res){
	//console.log("/cards/boosters");
	res.json(listBoosters());
}

exports.buyCards = function(req, res){
	console.log("/cards/buy");

	var nbCartes = req.body.nbCartes;
	var idUser = req.body.idUser;
	var tmpBooster = listBoosters(nbCartes);

	connection.query("SELECT * FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			if(results[0].pokeCoin >= tmpBooster.price){
				var pokeCoin = results[0].pokeCoin;
				pokeCoin -= tmpBooster.price;

				request.HTTP("127.0.0.1", "/cards/"+idUser+"/booster/"+nbCartes, "GET")
				.then(function(response){
					connection.query("UPDATE User SET pokeCoin="+pokeCoin+" WHERE idUser="+idUser, function(error, results, fields){});
					res.json(response);
				})
			}else{
				res.json({"pokeCoin": false});
			}
		}
	})
}

var listBoosters = function(nbCartes){
	var boosters =[
	{
		"description": "Pack de 5 Cartes",
		"img": "https://www.lannier.fr/pokecard/booster5.png",
		"nbCartes": 5,
		"price": PRICE_UNIT_CARD*5
	},
	{
		"description": "Pack de 10 Cartes",
		"img": "https://www.lannier.fr/pokecard/booster10.png",
		"nbCartes": 10,
		"price": PRICE_UNIT_CARD*9
	},
	{
		"description": "Pack de 20 Cartes",
		"img": "https://www.lannier.fr/pokecard/booster20.png",
		"nbCartes": 20,
		"price": PRICE_UNIT_CARD*16
	},
	{
		"description": "Pack de 50 Cartes",
		"img": "https://www.lannier.fr/pokecard/booster50.png",
		"nbCartes": 50,
		"price": PRICE_UNIT_CARD*42
	}];
	console.log(boosters)
	if(nbCartes == undefined){
		return boosters;
	} else {
		var tmp;
		boosters.forEach(function(booster){
			if(booster.nbCartes == nbCartes){
				tmp = booster;
			}
		})
		return tmp;
	}
}
