'use strict';
var https = require('https');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

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

function compareCard(element){
	return element == this.id;
}

function comparePokemon(element){
	return element == this.idPokemon;
}