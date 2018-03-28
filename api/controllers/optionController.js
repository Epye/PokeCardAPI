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

exports.editPseudo = function (req, res) {
	console.log('/option/editPseudo');

	var idUser = req.body.idUser;
	var pseudo = req.body.pseudo;

	request.HTTP('127.0.0.1', '/option/verifyPseudo', "POST", {
			"pseudo": pseudo
		})
		.then(function (response) {
			if (response.NOP == undefined) {
				connection.query('UPDATE User SET pseudo="' + pseudo + '" WHERE idUser=' + idUser, function (error, results, fields) {
					request.HTTP('127.0.0.1', '/user/' + idUser, "GET")
						.then(function (response) {
							res.json(response);
						})
				});
			} else {
				res.sendStatus(400);
			}
		})
}

exports.verifyPseudo = function (req, res) {
	console.log('/option/verifyPseudo');

	var pseudo = req.body.pseudo;

	connection.query("SELECT pseudo FROM User WHERE pseudo LIKE '" + pseudo + "'", function (error, results, fields) {
		if (results.length > 0) {
			res.json({
				"NOP": "NOP"
			})
		} else {
			res.json({
				"OK": "OK"
			})
		}
	});
}

exports.editZipCode = function (req, res) {
	console.log('/option/editZipCode');

	var idUser = req.body.idUser;
	var zipCode = req.body.zipCode;

	var url = "https://api.openweathermap.org";
	var path = "/data/2.5/weather?zip=" + zipCode + ",fr&units=metric&appid=4954128e227d8d77f59cd44d17dec764";

	request.HTTPS(url, path, "GET")
		.then(function (response) {
			if (response.cod != 404) {
				connection.query('UPDATE User SET zipCode="' + zipCode + '" WHERE idUser=' + idUser, function (error, results, fields) {});
				res.json({
					"OK": "OK"
				})
			} else {
				res.sendStatus(400)
			}
		})
		.catch(function (response) {
			res.sendStatus(400)
		})
}

exports.editProfilPicture = function (req, res) {
	console.log("/option/editProfilPicture");

	var idUser = req.body.idUser;
	var profilPicture = req.body.profilPicture;
	connection.query('UPDATE User SET picture="' + profilPicture + '" WHERE idUser=' + idUser, function (error, results, fields) {
		res.json({
			"OK": "OK"
		});
	});
}