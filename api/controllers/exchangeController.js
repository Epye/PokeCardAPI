'use strict';
var mysql = require('mysql');
var _ = require('lodash');
var request = require("../manager/requestManager");

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

exports.add = function(req, res){
	console.log("/exchange/add");

	var idSender = req.body.idSender;
	var idReceiver = req.body.idReceiver;
	var idCard = req.body.idCard;
	var status = req.body.status;

	var url = "https://api.pokemontcg.io";
	var path = "/v1/cards?id="+idCard;

	request.HTTPS(url, path, "GET")
	.then(function(response){
		connection.query("INSERT INTO Exchange (idSender, idReceiver, idCard, cardName, cardPicture, status) VALUES (" + idSender + ", " + idReceiver + ", \"" + idCard + "\", \"" + response.cards[0].name + "\", \"" + response.cards[0].imageUrl + "\", \"" + status+  "\")", function(error, results, fields){
			res.json({"OK": "OK"});
		});
	})
	.catch(function(){
		res.sendStatus(500);
	})

	
}

exports.getExchange = function(req, res){
	var idReceiver = req.params.idReceiver;
	console.log("/exchange/" + idReceiver);
	var response = [];

	connection.query("SELECT * FROM Exchange", function(error, results, fields){
		if(results.length > 0){

			var exchanges = [];
			results.forEach(function(result){
				if(result.idReceiver == idReceiver || result.idSender == idReceiver){
					exchanges.push({
						"idEchange": result.idEchange,
						"idReceiver": result.idReceiver,
						"idSender": result.idSender,
						"idCard": result.idCard,
						"cardName": result.cardName,
						"cardPicture": result.cardPicture,
						"status": result.status
					});
				}
			})

			connection.query("SELECT * FROM User", function(error, result, fields){
				if(result.length > 0){
					var users = result;

					exchanges.forEach(function(exchange){
						var tmpExchange = {
							"idEchange": exchange.idEchange,
							"idSender": exchange.idSender,
							"pseudoSender": "",
							"pictureSender": "",
							"cardPicture": exchange.cardPicture,
							"cardName": exchange.cardName,
							"status": exchange.status
						};

						users.forEach(function(user){
							if(user.idUser == exchange.idSender){
								tmpExchange.pseudoSender = user.pseudo;
								tmpExchange.pictureSender = user.picture;
							}
						})
						response.push(tmpExchange);
					})
					res.json(response);
				}else{
					res.sendStatus(500);
				}
			})
		}else{
			res.json([]);
		}
	})
}

exports.remove = function(req, res){
	var idEchange = req.params.idEchange;
	console.log("/exchange/" + idEchange);

	connection.query("DELETE FROM Exchange WHERE idEchange=" + idEchange, function(error, results, fields){
		res.end();
	});
}

exports.send = function(req, res){
	console.log("/exchange/send");

	var idSender = req.body.idSender;
	var idReceiver = req.body.idReceiver;
	var idCard = req.body.idCard;
	var status = req.body.status;

	var user = {};

	var body = {
		"idUser": idSender,
		"idCard": idCard
	}

	var url = "127.0.0.1";
	var path = "/user/removeCard";

	request.HTTP(url, path, "DELETE", body)
	.then(function(response){
		user = response;
		path = "/user/addCard";

		body = {
			"idUser": idReceiver,
			"cards": [idCard]
		}
		return request.HTTP(url, path, "POST", body);
	})
	.then(function(response){
		res.json(user);

		path = "/exchange/add";
		body = {
			"idSender": idSender,
			"idReceiver": idReceiver,
			"idCard": idCard,
			"status": status
		}
		request.HTTP(url, path, "POST", body);
	})
}
