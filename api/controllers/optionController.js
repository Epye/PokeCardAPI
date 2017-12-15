'use strict';
var https = require('https');
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

	connection.query('UPDATE User SET pseudo="' + pseudo + '" WHERE idUser=' + idUser, function(error, results, fields){
		res.sendStatus(200);
	});
}

exports.verifyPseudo = function(req, res){
	console.log('/option/verifyPseudo');

	var pseudo = req.body.pseudo;

	connection.query("SELECT pseudo FROM User WHERE pseudo LIKE '" + pseudo + "'", function(error, results, fields){
		if(results.length > 0){
			res.sendStatus(400)
		}else{
			res.json({"pseudo": false});
		}
	});
}