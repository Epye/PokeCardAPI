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

exports.addAnnounce = function(req, res){
	console.log("/announce/add");

	var idUser = req.body.idUser;
	var idCardProposed = req.body.idCardProposed;
	var idCardsWanted = req.body.idCardsWanted;

	connection.query("INSERT INTO Announce (idUser, idCardProposed, idCardsWanted) VALUES (" + idUser + ", " + idCardProposed + ", \"" + idCardsWanted.toString() + "\")", function(error, results, fields){
		res.json("OK");
	})
}