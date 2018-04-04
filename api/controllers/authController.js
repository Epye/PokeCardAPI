'use strict';
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
var request = require("../manager/requestManager");

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

connection.connect();

exports.login = function (req, res) {
	console.log("/login");
	var pseudo = req.body.pseudo;
	var password = req.body.password;

	var response = {};

	connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function (error, results, fields) {
		if (results.length > 0) {
			if (bcrypt.compareSync(password, results[0].password)) {
				res.json(formatResponse(results[0]));
			} else {
				res.sendStatus(400)
			}
		} else {
			res.sendStatus(400)
		}
	});
}

exports.signup = function (req, res) {
	console.log("/signup");
	var pseudo = req.body.pseudo;
	var password = req.body.password;
	password = bcrypt.hashSync(password);

	var response = {};
	connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function (error, results, fields) {
		if (results.length == 0) {
			connection.query('INSERT INTO User (pseudo, password, picture) VALUES ("' + pseudo + '", "' + password + '", "https://eternia.fr/public/media/sl/sprites/formes/025_kanto.png")', function (error, results, fiels) {
				connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function (error, results, fields) {
					if (results.length > 0) {
						var url = "127.0.0.1";
						var path = "/cards/" + results[0].idUser + "/booster/10";
						request.HTTP(url, path, "GET")
							.then(function (response) {
								connection.query('SELECT * FROM User WHERE pseudo LIKE "' + pseudo + '"', function (error, results, fields) {
									if (results.length > 0) {
										res.json(formatResponse(results[0]));
									}
								})
							})
							.catch(function (error) {
								res.json(formatResponse(results[0]));
							})
					}
				});
			});
		} else {
			res.sendStatus(400)
		}
	});
}

exports.verify = function (req, res) {
	console.log("/verify");
	var idAccount = req.body.idUser;
	var pseudo = req.body.pseudo;
	var password = req.body.password;
	var picture = req.body.picture;

	connection.query('SELECT * FROM User WHERE idAccount LIKE "' + idAccount + '"', function (error, results, fields) {
		if (results.length > 0) {
			res.json(formatResponse(results[0]));
		} else {
			connection.query('INSERT INTO User (idAccount, pseudo, password, picture) VALUES ("' + idAccount + '", "' + pseudo + '", "' + password + '", "' + picture + '")', function (error, results, fiels) {
				connection.query('SELECT * FROM User WHERE idAccount LIKE "' + idAccount + '"', function (error, results, fields) {
					if (results.length > 0) {
						var url = "127.0.0.1";
						var path = "/cards/" + results[0].idUser + "/booster/10";
						request.HTTP(url, path, "GET")
							.then(function (response) {
								connection.query('SELECT * FROM User WHERE idAccount LIKE "' + idAccount + '"', function (error, results, fields) {
									if (results.length > 0) {
										res.json(formatResponse(results[0]));
									}
								})
							})
							.catch(function (error) {
								res.json(formatResponse(results[0]));
							})
					}
				});
			});
		};
	});
}