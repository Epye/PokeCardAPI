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
				if(response.cards != null){
					response.cards = response.cards.split(",");
				}
				else{
					response.cards = [];
				}

				if(response.pokemon != null){
					response.pokemon = response.pokemon.split(",");
				}
				else{
					response.pokemon = [];
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
			connection.query('INSERT INTO User (pseudo, password, profilePicture) VALUES ("' + pseudo + '", "' + password + '", "https://eternia.fr/public/media/sl/sprites/formes/025_kanto.png")', function(error, results, fiels) {
				connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function(error, results, fields) {
					if(results) {
						var response = results[0];
						delete response.password;
						response.cards = [];
						response.pokemon = [];
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
	var profilePicture = req.body.profilePicture;

	connection.query('SELECT * FROM User WHERE idAccount LIKE "' + idAccount + '"', function(error, results, fields) {
		if(results.length > 0) {
			var response = results[0];
			delete response.password;
			res.json(response);
		} else {
			connection.query('INSERT INTO User (idAccount, pseudo, password, profilePicture) VALUES ("' + idAccount + '", "' + pseudo + '", "' + password + '", "' + profilePicture + '")', function(error, results, fiels) {
				connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function(error, results, fields) {
					if(results.length > 0) {
						var response = results[0];
						delete response.password;
						if(response.cards != null){
							response.cards = response.cards.split(",");
						}
						else{
							response.cards = [];
						}

						if(response.pokemon != null){
							response.pokemon = response.pokemon.split(",");
						}
						else{
							response.pokemon = [];
						}
						res.json(response);
					}
				});
			});
		};
	});
}