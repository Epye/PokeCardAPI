'use strict';
var https = require('https');
var request = require('../manager/requestManager');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

exports.editPseudo = function(req, res){
	console.log('/option/editPseudo');

	var idUser = req.body.idUser;
	var pseudo = req.body.pseudo;

	request.HTTP('127.0.0.1', '/option/verifyPseudo', "POST", {"pseudo": pseudo})
	.then(function(response){
		if(response.NOP == undefined){
			connection.query('UPDATE User SET pseudo="' + pseudo + '" WHERE idUser=' + idUser, function(error, results, fields){
				request.HTTP('127.0.0.1', '/user/'+idUser, "GET")
				.then(function(response){
					res.json(response);
				})
			});
		}else{
			res.sendStatus(400);
		}
	})
}

exports.verifyPseudo = function(req, res){
	console.log('/option/verifyPseudo');

	var pseudo = req.body.pseudo;

	connection.query("SELECT pseudo FROM User WHERE pseudo LIKE '" + pseudo + "'", function(error, results, fields){
		if(results.length > 0){
			res.json({"NOP": "NOP"})
		}else{
			res.json({"OK": "OK"})
		}
	});
}