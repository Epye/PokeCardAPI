'use strict';
var https = require('https');
var http = require('http');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

connection.connect();

exports.login = function(req, res) {
	console.log("/login");
	var pseudo = req.body.pseudo;
	var password = req.body.password;

	var response = {};

	connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function(error, results, fields) {
		if(results.length > 0) {
			if(bcrypt.compareSync(password, results[0].password)) {
				var response = results[0];
				delete response.password;
				if(response.listeCards != null){
					response.listeCards = response.listeCards.split(",");
				}
				else{
					response.listeCards = [];
				}

				if(response.listePokemon != null){
					response.listePokemon = response.listePokemon.split(",");
				}
				else{
					response.listePokemon = [];
				}
				res.json(response);
			} else {
				res.json({ "pseudo": true, "password": false });
			}
		} else {
			res.json({ "pseudo": false , "password": false});
		}
	});
}

exports.signup = function(req, res) {
	console.log("/signup");
	var pseudo = req.body.pseudo;
	var password = req.body.password;
	password = bcrypt.hashSync(password);
	

	var response = {};
	connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function(error, results, fields) {
		if(results.length == 0) {
			connection.query('INSERT INTO User (pseudo, password, picture) VALUES ("' + pseudo + '", "' + password + '", "https://eternia.fr/public/media/sl/sprites/formes/025_kanto.png")', function(error, results, fiels) {
				connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function(error, results, fields) {
					if(results.length > 0) {
						var response = results[0];
						delete response.password;
						res.json(response);
					}
				});
			});
		}else{
			res.json({"pseudo": false});
		}
	});
}

exports.verify = function(req, res){
	console.log("/verify");
	var idAccount = req.body.idUser;
	var pseudo = req.body.pseudo;
	var password = req.body.password;
	var picture = req.body.picture;

	connection.query('SELECT * FROM User WHERE idAccount LIKE "' + idAccount + '"', function(error, results, fields) {
		if(results.length > 0) {
			var response = results[0];
			delete response.password;
			if(response.listeCards != null){
				response.listeCards = response.listeCards.split(",");
			}
			else{
				response.listeCards = [];
			}

			if(response.listePokemon != null){
				response.listePokemon = response.listePokemon.split(",");
			}
			else{
				response.listePokemon = [];
			}
			res.json(response);
		} else {
			connection.query('INSERT INTO User (idAccount, pseudo, password, picture) VALUES ("' + idAccount + '", "' + pseudo + '", "' + password + '", "' + picture + '")', function(error, results, fiels) {
				connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function(error, results, fields) {
					if(results.length > 0) {
						var response = results[0];
						delete response.password;
						if(response.listeCards != null){
							response.listeCards = response.listeCards.split(",");
						}
						else{
							response.listeCards = [];
						}

						if(response.listePokemon != null){
							response.listePokemon = response.listePokemon.split(",");
						}
						else{
							response.listePokemon = [];
						}
						res.json(response);
					}
				});
			});
		};
	});
} 