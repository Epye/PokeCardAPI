'use strict';
var _ = require('lodash');
var mysql = require('mysql');
var request = require("../manager/requestManager");

exports.getChuckNorrisFact = function(req, res){
	var idUser = req.params.idUser;
	console.log("/chuckNorris/"+idUser+"/random");

	var finalResult = {};

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
		return request.HTTP("127.0.0.1", "/user/addPokeCoins", "POST", body);
	})
	.then(function(response){
		res.json(finalResult);
	})
}