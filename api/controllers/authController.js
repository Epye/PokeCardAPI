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
	var mail = req.body.mail;
	var password = req.body.password;

	var response = {};

	connection.query('SELECT * FROM User WHERE mail LIKE "' + mail + '"', function(error, results, fields) {
		if(results.length > 0) {
			if(bcrypt.compareSync(password, results[0].password)) {
				var response = results[0];
				delete response.password;
				res.json(response);
			} else {
				res.json({ password: false });
			}
		} else {
			res.json({ user: false });
		}
	});
}

exports.signup = function(req, res) {
	console.log("/signup");
	var mail = req.body.mail;
	var password = req.body.password;
	password = bcrypt.hashSync(password);
	

	var response = {};

	connection.query('INSERT INTO User (mail, password) VALUES ("' + mail + '", "' + password + '")', function(error, results, fiels) {
		connection.query('SELECT * FROM User WHERE mail LIKE "' + mail + '"', function(error, results, fields) {
			if(results) {
				var response = results[0];
				delete response.password;
				res.json(response);
			}
		});
	});
}

exports.verify = function(req, res){
	console.log("/verify");
	console.log(req.body)
	var mail = req.body.mail;
	var password = req.body.password;

	connection.query('SELECT * FROM User WHERE mail LIKE "' + mail + '"', function(error, results, fields) {
		if(results.length > 0) {
			var response = results[0];
			delete response.password;
			res.json(response);
		} else {
			connection.query('INSERT INTO User (mail, password) VALUES ("' + mail + '", "' + password + '")', function(error, results, fiels) {
				connection.query('SELECT * FROM User WHERE mail LIKE "' + mail + '"', function(error, results, fields) {
					if(results) {
						var response = results[0];
						delete response.password;
						res.json(response);
					}
				});
			});
		};
	});
}