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

exports.userPokedex = function (req, res) {
	var idUser = req.params.idUser;

	console.log('/user/' + idUser + '/pokedex');

	var url = "https://pokeapi.co";
	var path = "/api/v2/pokemon/?limit=802";

	request.HTTPS(url, path, "GET")
		.then(function (response) {
			var finalResult = [];

			connection.query("SELECT listePokemon FROM User WHERE idUser=" + idUser, function (error, results, fields) {
				if (results.length > 0) {
					var userPokemon = results[0].listePokemon;

					if (userPokemon != "" && userPokemon != null) {
						userPokemon = userPokemon.split(",");

						userPokemon = _.sortBy(userPokemon, function (o) {
							return parseInt(o);
						});

						userPokemon.forEach(function (pokemonId) {
							if (pokemonId != "") {
								finalResult.push({
									"id": _.parseInt(pokemonId),
									"name": response.results[pokemonId - 1].name,
									"urlPicture": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemonId + ".png"
								});
							}
						});
					}
					res.json(finalResult);
				} else {
					res.sendStatus(400);
				}
			})
		})
		.catch(function (error) {
			res.sendStatus(500);
		})
}

exports.getUser = function (req, res) {
	var idUser = req.params.idUser;
	console.log('/user/' + idUser);

	connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			res.json(formatResponse(results[0]));
		} else {
			res.sendStatus(400);
		}
	});
}

exports.addCard = function (req, res) {
	console.log('/user/addCard');

	var cards = req.body.cards;
	var idUser = req.body.idUser;

	connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var userCards = formatArray(results[0].listeCards);
			var userPokemon = results[0].listePokemon;
			if (userPokemon == null || userPokemon == undefined) {
				userPokemon = "";
			}

			var url = "https://api.pokemontcg.io";
			var path = "/v1/cards?id=";

			cards.forEach(function (card) {
				path += card + "|";
			})

			request.HTTPS(url, path, "GET")
				.then(function (response) {
					cards.forEach(function (card, index) {
						userCards.push(card);
						if (!userPokemon.includes(response.cards[index].nationalPokedexNumber)) {
							userPokemon += "," + response.cards[index].nationalPokedexNumber;
						}
					});

					userCards = userCards.toString();

					if (userPokemon.charAt(0) == ",") {
						userPokemon = userPokemon.replace(",", "");
					}
					if (userCards.charAt(0) == ",") {
						userCards = userCards.replace(",", "");
					}

					connection.query("UPDATE User SET listePokemon='" + userPokemon + "', listeCards='" + userCards + "' WHERE idUser=" + idUser, function (error, results, fields) {
						connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
							if (results.length > 0) {
								res.json(formatResponse(results[0]));
							} else {
								res.sendStatus(400);
							}
						});
					});
				})
		} else {
			res.sendStatus(400)
		}
	});
}

exports.addCardNFC = function (req, res) {
	console.log('/user/addCardNFC');

	var idCard = req.body.idCard;
	var idUser = req.body.idUser;

	connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var userCards = formatArray(results[0].listeCards);
			var userPokemon = results[0].listePokemon;
			if (userPokemon == null || userPokemon == undefined) {
				userPokemon = "";
			}

			var url = "https://api.pokemontcg.io";
			var path = "/v1/cards?id=" + idCard;

			request.HTTPS(url, path, "GET")
				.then(function (response) {
					userCards.push(idCard);
					if (!userPokemon.includes(response.cards[0].nationalPokedexNumber)) {
						userPokemon += "," + response.cards[0].nationalPokedexNumber;
					}

					userCards = userCards.toString();

					if (userPokemon.charAt(0) == ",") {
						userPokemon = userPokemon.replace(",", "");
					}
					if (userCards.charAt(0) == ",") {
						userCards = userCards.replace(",", "");
					}

					var finalResult = {
						"id": idCard,
						"urlPicture": response.cards[0].imageUrl,
						"idPokemon": response.cards[0].nationalPokedexNumber,
						"price": price(response.cards[0].rarity)
					}
					connection.query("UPDATE User SET listePokemon='" + userPokemon + "', listeCards='" + userCards + "' WHERE idUser=" + idUser, function (error, results, fields) {
						res.json(finalResult);
					});
				})
		} else {
			res.sendStatus(400)
		}
	});
}

exports.removeCard = function (req, res) {
	console.log('/user/removeCard');

	var idCard = req.body.idCard;
	var idUser = req.body.idUser;

	connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var userCards = results[0].listeCards;
			var userPokemon = results[0].listePokemon;
			var idPokemon = 0;

			var url = "https://api.pokemontcg.io";
			var path = "/v1/cards?id=" + idCard;

			request.HTTPS(url, path, "GET")
				.then(function (response) {
					if (response.cards.length > 0) {
						idPokemon = response.cards[0].nationalPokedexNumber;
						path = "/v1/cards?nationalPokedexNumber=" + idPokemon;

						return request.HTTPS(url, path, "GET");
					} else {
						res.sendStatus(400);
					}
				})
				.then(function (response) {
					var cards = [];

					response.cards.forEach(function (card) {
						cards.push(card.id);
					})
					userCards = formatVirgule(userCards.replace(idCard, ""));

					var hasCard = false;
					cards.forEach(function (card) {
						if (userCards.includes(card)) {
							hasCard = true;
							return false;
						}
					})
					if (!hasCard) {
						userPokemon = formatVirgule(userPokemon.replace(idPokemon.toString(), ""));
					}

					if (userPokemon.length > 0 && userPokemon.charAt(0) == ",") {
						userPokemon = userPokemon.replace(",", "");
					}
					if (userCards.length > 0 && userCards.charAt(0) == ",") {
						userCards = userCards.replace(",", "");
					}

					connection.query("UPDATE User SET listePokemon='" + userPokemon + "', listeCards='" + userCards + "' WHERE idUser=" + idUser, function (error, results, fields) {
						connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
							if (results.length > 0) {
								res.json(formatResponse(results[0]));
							}
						});
					});
				})
		} else {
			res.sendStatus(500);
		}
	})
}

exports.getCardsPokemonUser = function (req, res) {
	var idUser = req.params.idUser;
	var idPokemon = req.params.idPokemon;
	console.log("/user/" + idUser + "/" + idPokemon + "/cards");

	connection.query("SELECT listeCards FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var listCards = results[0].listeCards;
			listCards = listCards.split(",");

			var finalResult = [];

			var url = "https://api.pokemontcg.io";
			var path = "/v1/cards?nationalPokedexNumber=" + idPokemon;

			request.HTTPS(url, path, "GET")
				.then(function (response) {
					response.cards.forEach(function (card) {
						if (listCards.includes(card.id)) {
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

exports.addFriend = function (req, res) {
	var idUser = req.params.idUser;
	console.log("/user/" + idUser + "/addFriend");
	var pseudoFriend = req.body.pseudoFriend;

	connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var userFriends = results[0].friends;
			var userPseudo = results[0].pseudo;

			if (userFriends == null || userFriends == undefined) {
				userFriends = "";
			}

			if (userFriends.includes(pseudoFriend)) {
				res.sendStatus(400);
			} else {
				connection.query("SELECT * FROM User", function (error, result, fields) {
					if (result.length > 0) {
						var tmp = false;
						var friend = {};
						result.forEach(function (user) {
							if (user.pseudo == pseudoFriend) {
								tmp = true;
								if (user.friends == null || user.friends.length == 0) {
									user.friends = userPseudo;
								} else {
									user.friends += "," + userPseudo;
								}
							}
						})
						if (tmp) {
							if (userFriends.length == 0) {
								userFriends = pseudoFriend;
							} else {
								userFriends += "," + pseudoFriend;
							}
							connection.query("UPDATE User SET friends=\"" + userFriends + "\" WHERE idUser=" + idUser, function () {});
							connection.query("UPDATE User SET friends=\"" + friend.friends + "\" WHERE idUser=" + friend.idUser, function () {});
							request.HTTP('127.0.0.1', '/user/' + idUser + '/getFriends', 'GET')
								.then(function (response) {
									res.json(response);
								})
						} else {
							res.sendStatus(400);
						}
					} else {
						res.sendStatus(500);
					}
				})
			}
		} else {
			res.sendStatus(400);
		}
	})
}

exports.delFriend = function (req, res) {
	var idUser = req.params.idUser;
	console.log("/user/" + idUser + "/delFriend");
	var pseudoFriend = req.body.pseudoFriend;

	connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var userFriends = results[0].friends;
			var userPseudo = results[0].pseudo;

			if (!userFriends.includes(pseudoFriend)) {
				res.sendStatus(400);
			} else {
				userFriends = userFriends.replace(pseudoFriend, "");
				userFriends = userFriends.replace(",,", ",");
				connection.query("SELECT * FROM User WHERE pseudo LIKE \"" + pseudoFriend + "\"", function (error, result, fields) {
					if (result.length > 0) {
						var friendFriends = result[0].friends;
						var idFriend = result[0].idUser;
						friendFriends = friendFriends.replace(userPseudo, "");
						friendFriends = friendFriends.replace(",,", ",");

						connection.query("UPDATE User SET friends=\"" + userFriends + "\" WHERE idUser=" + idUser, function () {});
						connection.query("UPDATE User SET friends=\"" + friendFriends + "\" WHERE idUser=" + idFriend, function () {});
						request.HTTP('127.0.0.1', '/user/' + idUser + '/getFriends', 'GET')
							.then(function (response) {
								res.json(response);
							})
					}
				});

			}
		} else {
			res.sendStatus(400);
		}
	})
}

exports.getFriends = function (req, res) {
	var idUser = req.params.idUser;
	console.log("/user/" + idUser + "/getFriends");

	connection.query("SELECT friends FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var userFriends = results[0].friends;
			if (userFriends == null || userFriends == undefined) {
				userFriends = "";
			}

			connection.query("SELECT * FROM User", function (error, results, fields) {
				if (results.length > 0) {
					var friends = [];
					results.forEach(function (user) {
						if (userFriends.includes(user.pseudo)) {
							friends.push({
								"idUser": user.idUser,
								"pseudo": user.pseudo,
								"picture": user.picture,
								"nbCartes": user.listeCards.split(",").length
							});
						}
					})
					res.json(friends);
				} else {
					res.sendStatus(400);
				}
			})
		} else {
			res.sendStatus(400);
		}
	})
}

exports.addPokeCoins = function (req, res) {
	var idUser = req.body.idUser;
	console.log("/user/addPokeCoins");

	var pokeCoinsWin = req.body.pokeCoins;

	connection.query("SELECT * FROM User WHERE idUser=" + idUser, function (error, results, fields) {
		if (results.length > 0) {
			var userPokeCoins = parseInt(results[0].pokeCoin);
			userPokeCoins += pokeCoinsWin;
			connection.query("UPDATE User SET pokeCoin=" + userPokeCoins + " WHERE idUser=" + idUser, function () {});
			res.json({
				"OK": "OK"
			});
		} else {
			res.sendStatus(500);
		}
	});
}

exports.getListeProfilPicture = function (req, res) {
	console.log("/user/picture/list");
	connection.query("SELECT * FROM profilPicture", function (error, results, fields) {
		if (results.length > 0) {
			res.json(results);
		} else {
			res.json([]);
		}
	});
}

function compareCard(element) {
	return element == this.id;
}

function comparePokemon(element) {
	return element == this.idPokemon;
}