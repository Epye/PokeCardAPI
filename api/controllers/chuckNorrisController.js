'use strict';
var _ = require('lodash');
var mysql = require('mysql');
var request = require("../manager/requestManager");
var translate = require('google-translate-api');

exports.getChuckNorrisFact = function(req, res){
	var idUser = req.params.idUser;
	console.log("/chuckNorris/"+idUser+"/random");

	var finalResult = {
		"picture": "",
		"fact": "",
		"pokeCoinsWin": 0
	};

	var url = "https://api.chucknorris.io";
	var path = "/jokes/random";

	request.HTTPS(url, path, "GET")
	.then(function(response){
		finalResult = {
			"picture": response.icon_url,
			"fact": response.value,
			"pokeCoinsWin": 20
		}
		var body = {
			"pokeCoins": 20,
			"idUser": idUser
		}
		return translate(category.name, {to: 'fr'});
	})
	.then(function(response){
		finalResult.fact = response.text;
		res.json(finalResult);
		request.HTTP("127.0.0.1", "/user/addPokeCoins", "POST", body);
	})
}