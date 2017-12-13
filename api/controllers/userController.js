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

exports.userPokedex = function(req, res){
	var idUser = req.params.idUser;

	console.log('/user/'+idUser+'/pokedex');

	var url = "https://pokeapi.co";
	var path = "/api/v2/pokemon/?limit=802";

	request.HTTPS(url, path, "GET")
	.then(function(response){
		var finalResult = [];

		connection.query("SELECT listePokemon FROM User WHERE idUser="+idUser, function(error, results, fields){
			if(results.length > 0){
				var userPokemon = results[0].listePokemon;

				if(userPokemon != "" && userPokemon != null){
					userPokemon = userPokemon.split(",");

					userPokemon = _.sortBy(userPokemon, function(o){ return parseInt(o);});

					userPokemon.forEach(function(pokemonId){
						if(pokemonId != ""){
							finalResult.push({
								"id": _.parseInt(pokemonId),
								"name": response.results[pokemonId-1].name,
								"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemonId + ".png"
							});
						}
					});
				}

				res.json(finalResult);
			}else{
				res.json({user: false});
			}
		})
	})
	.catch(function(error){
		console.log(error);
		res.end();
	})
}

exports.addCard = function(req, res){
	console.log('/user/addCard');

	var cards = req.body.cards;
	var idUser = req.body.idUser;

	connection.query("SELECT * FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			var userCards = results[0].listeCards;
			var userPokemon = results[0].listePokemon;

			if(userPokemon != null){
				userCards = userCards.split(",");
				userPokemon = userPokemon.split(",");
			}else{
				userCards = [];
				userPokemon = [];
			}

			cards.forEach(function(card){
				userCards.push(card.id);
				if(userPokemon.find(comparePokemon, card) == undefined){
					userPokemon.push(card.idPokemon);
				}
			});

			userPokemon = userPokemon.toString();
			userCards = userCards.toString();

			if(userPokemon.charAt(0) == ","){
				userPokemon = userPokemon.replace(",", "");
			}
			if(userCards.charAt(0) == ","){
				userCards = userCards.replace(",", "");
			}

			connection.query("UPDATE User SET listePokemon='" + userPokemon + "', listeCards='" + userCards + "' WHERE idUser="+idUser, function(error, results, fields){
				connection.query("SELECT * FROM User WHERE idUser=" + idUser, function(error, results, fields){
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

exports.removeCard = function(req, res){
	console.log('/user/removeCard');

	var idCard = req.body.idCard;
	var idUser = req.body.idUser;

	connection.query("SELECT * FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			var userCards = results[0].listeCards;
			var userPokemon = results[0].listePokemon;
			var idPokemon = 0;

			var url = "https://api.pokemontcg.io";
			var path = "/v1/cards?id="+idCard;

			request.HTTPS(url, path, "GET")
			.then(function(response){
				if(response.cards.length > 0){
					idPokemon = response.cards[0].nationalPokedexNumber;
					path = "/v1/cards?nationalPokedexNumber="+idPokemon;

					return request.HTTPS(url, path, "GET");
				}else{
					res.json({"ERREUR": "Card not found"});
				}
			})
			.then(function(response){
				var cards = [];

				response.cards.forEach(function(card){
					cards.push(card.id);
				})


				userCards = userCards.replace(idCard, "").replace(",,", ",");

				var hasCard = false;
				cards.forEach(function(card){
					if(userCards.includes(card)){
						hasCard = true;
						return false;
					}
				})
				if(!hasCard){
					userPokemon = userPokemon.replace(idPokemon, "");
				}

				if(userPokemon.length > 0 && userPokemon.charAt(0) == ","){
					userPokemon = userPokemon.replace(",", "");
				}
				if(userCards.length > 0 && userCards.charAt(0) == ","){
					userCards = userCards.replace(",", "");
				}

				connection.query("UPDATE User SET listePokemon='" + userPokemon + "', listeCards='" + userCards + "' WHERE idUser="+idUser, function(error, results, fields){
					connection.query("SELECT * FROM User WHERE idUser=" + idUser, function(error, results, fields){
						if(results.length > 0){
							delete results[0].password;
							results[0].listePokemon = results[0].listePokemon.split(",");
							results[0].listeCards = results[0].listeCards.split(",");
							res.json(results[0]);
						}
					});
				});
			})
		}else{
			res.sendStatus(500);
		}
	})
}

exports.getCardsPokemonUser = function(req, res){
	var idUser = req.params.idUser;
	var idPokemon = req.params.idPokemon;
	console.log("/user/" + idUser + "/" + idPokemon + "/cards");

	connection.query("SELECT listeCards FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			var listCards = results[0].listeCards;
			listCards = listCards.split(",");

			var finalResult = [];

			var url = "https://api.pokemontcg.io";
			var path = "/v1/cards?nationalPokedexNumber=" + idPokemon;

			request.HTTPS(url, path, "GET")
			.then(function(response){
				response.cards.forEach(function(card){
					if(listCards.includes(card.id)){
						finalResult.push({
							"id": card.id,
							"urlPicture": card.imageUrl,
							"price": 0
						});
					};
				});

				res.json(finalResult);
			})
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
					var friends = results[0].friends;
					if(userFriends.length == 0){
						userFriends = idFriend;
					}else{
						userFriends += "," + idFriend;
					}
					if(friends.length > 0){
						friends = idUser;
					}else{
						friends += "," + idUser;
					}

					connection.query("UPDATE User SET friends=\""+userFriends+"\" WHERE idUser="+idUser, function(){});
					connection.query("UPDATE User SET friends=\""+friends+"\" WHERE idUser="+idFriend, function(){});
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