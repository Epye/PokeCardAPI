'use strict';
var https = require('https');
var http = require('http');
var mysql = require('mysql');
var _ = require('lodash');

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

	connection.query("INSERT INTO Exchange (idSender, idReceiver, idCard) VALUES (" + idSender + ", " + idReceiver + ", \"" + idCard + "\")", function(error, results, fields){
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

	connection.query("SELECT cards FROM User WHERE idUser=" + idSender, function(error, results, fields){
		if(results.length > 0){
			var cards = results[0].cards;
			if(cards.includes(idCard)){
				cards = cards.replace(idCard, "").replace(",,", ",");
				connection.query("UPDATE User SET cards=\""+ cards + "\" WHERE idUser="+idSender, function(errors, result, field){
					connection.query("SELECT cards FROM User WHERE idUser=" + idReceiver, function(error, results, fields){
						if(results.length > 0){
							var cards = results[0].cards;
							if(cards.length == 0){
								cards = idCard;
							}else{
								cards += "," + idCard;
							}
							connection.query("UPDATE User SET cards=\""+ cards + "\" WHERE idUser="+idReceiver, function(){
								res.end();

								var data = "";

								var body = {
									"idSender": idSender,
									"idReceiver": idReceiver,
									"idCard": idCard
								}

								var options = {
									port: 3000,
									hostname: '127.0.0.1',
									method: 'POST',
									path: '/exchange/add',
									headers: {
										'Content-Type': 'application/json',
										'Content-Length': Buffer.byteLength(JSON.stringify(body))
									}
								};
								var request = http.request(options, (results) => {});

								request.write(JSON.stringify(body));

								request.on('error', (e) => {
									console.error(e);
								});

								request.end();
							});
						}
					});

				});
			}else{
				res.sendStatus(500);
				res.end();
			}
		}
	});
}
