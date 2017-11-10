'use strict';
var https = require('https');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

exports.editPseudo = function(req, res){
	console.log('/opion/editPseudo');

	var idUser = req.body.idUser;
	var pseudo = req.body.pseudo;

	console.log(idUser, pseudo)

	connection.query('UPDATE User SET pseudo="' + pseudo + '" WHERE idUser=' + idUser, function(error, results, fields){
		res.status(200);
		res.send();
	})
}