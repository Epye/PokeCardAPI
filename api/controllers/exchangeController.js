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

	connection.query("INSERT INTO Exchange (idSender, idReceiver, idCard, status) VALUES (" + idSender + ", " + idReceiver + ", \"" + idCard + "\", \"" + status+  "\")", function(error, results, fields){
		res.json({"OK": "OK"});
	});
}

exports.getExchange = function(req, res){
	var idReceiver = req.params.idReceiver;
	console.log("/exchange/" + idReceiver);

	connection.query("SELECT * FROM Exchange WHERE idReceiver=" + idReceiver, function(error, results, fields){
		res.json(results);
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
			"status": "send"
		}
		request.HTTP(url, path, "POST", body);
	})
}
