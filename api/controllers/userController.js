'use strict';
var https = require('https');
var mysql = require('mysql');
var _ = require('lodash');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

exports.userPokedex = function(req, res){
	var idUser = req.params.idUser;

	console.log('/user/'+idUser+'/pokedex');

	var options = "https://pokeapi.co/api/v2/pokemon/?limit=802&name";

	var data = "";

	var request = https.get(options, (result) => {

		result.on('data', (d) => {
			data += d;
		});

		result.on('end', function() {
			var tmpData = JSON.parse(data);

			var finalResult = [];

			connection.query("SELECT pokemon FROM User WHERE idUser="+idUser, function(error, results, fields){
				if(results.length > 0){
					var userPokemon = results[0].pokemon;

					if(userPokemon != "" && userPokemon != null){
						userPokemon = userPokemon.split(",");

						userPokemon = _.sortBy(userPokemon, function(o){ return parseInt(o);});

						userPokemon.forEach(function(pokemonId){
							if(pokemonId != ""){
								finalResult.push({
									"id": _.parseInt(pokemonId),
									"name": tmpData.results[pokemonId-1].name,
									"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemonId + ".png"
								});
							}
						});
					}
					
					res.json(finalResult);
				}else{
					res.json({user: false});
				}
			});
			
		});

	});

	request.on('error', (e) => {
		console.error(e);
	});

	request.end();
}

exports.addCard = function(req, res){
	console.log('/user/addCard');

	var cards = req.body.cards;
	var idUser = req.body.idUser;

	connection.query("SELECT * FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			var userCards = results[0].cards;
			var userPokemon = results[0].pokemon;

			if(userPokemon != null){
				userCards = userCards.split(",");
				userPokemon = userPokemon.split(",");
			}else{
				userCards = [];
				userPokemon = [];
			}

			cards.forEach(function(card){
				if(userCards.find(compareCard, card) == undefined){
					userCards.push(card.id);
				}
				if(userPokemon.find(comparePokemon, card) == undefined){
					userPokemon.push(card.idPokemon);
				}
			});

			connection.query("UPDATE User SET pokemon='" + userPokemon.toString() + "', cards='" + userCards.toString() + "' WHERE idUser="+idUser, function(error, results, fields){
				connection.query("SELECT idUser, pokemon, cards FROM User WHERE idUser=" + idUser, function(error, results, fields){
					if(results.length > 0){
						res.json(results[0]);
					}else{
						res.json({"idUser": false});
					}
				});
			});
		}else{
			res.json({"idUser": false});
		}
	});
}

exports.getCardsPokemonUser = function(req, res){
	var idUser = req.params.idUser;
	var idPokemon = req.params.idPokemon;
	console.log("/user/" + idUser + "/" + idPokemon + "/cards");

	connection.query("SELECT cards FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			var listCards = results[0].cards;
			listCards = listCards.split(",");

			var finalResult = [];

			var options = "https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=" + idPokemon;

			var data = "";

			var request = https.get(options, (result) => {

				result.on('data', (d) => {
					data += d;
				});

				result.on('end', function() {
					var tmpData = JSON.parse(data);

					tmpData.cards.forEach(function(card){
						if(listCards.includes(card.id)){
							finalResult.push({
								"id": card.id,
								"urlPicture": card.imageUrl,
								"price": 0
							});
						};
					});

					res.json(finalResult);
				});
			});

			request.on('error', (e) => {
				console.error(e);
			});

			request.end();

		}
	})
}

exports.addFriend = function(req, res){
	var idUser = req.params.idUser;
	console.log("/user/" + idUser + "/addFriend");
	var idFriend = req.body.idFriend;

	connection.query("SELECT friends FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			var userFriends = results[0].friends;

			connection.query("SELECT friends FROM User WHERE idUser="+idFriend, function(error, results, fields){
				if(results.length > 0){
					var friend = results[0].friends;
					if(userFriends.length == 0){
						userFriends = idFriend;
					}else{
						userFriends += "," + idFriend;
					}
				}else{
					res.json({"idFriend": false})
				}
			})
		}else{
			res.json({"idUser": false});
		}
	})
}



function compareCard(element){
	return element == this.id;
}

function comparePokemon(element){
	return element == this.idPokemon;
}