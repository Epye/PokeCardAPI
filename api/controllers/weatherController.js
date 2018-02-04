'use strict';
var _ = require('lodash');
var request = require("../manager/requestManager");
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pokecard'
});

exports.weather = function(req, res){
	var idUser = req.params.idUser;
	console.log("/weather/"+idUser);

	connection.query("SELECT * FROM User WHERE idUser="+idUser, function(error, results, fields){
		if(results.length > 0){
			var zipCode = results[0].zipCode;

			var url = "https://api.openweathermap.org";
			var path = "/data/2.5/weather?zip="+zipCode+",fr&units=metric&appid=4954128e227d8d77f59cd44d17dec764";

			request.HTTPS(url, path, 'GET')
			.then(function(response){
				var result = {
					"temp": response.main.temp+"°C",
					"img": "http://openweathermap.org/img/w/"+response.weather[0].icon+".png"
				}
				res.json(result);
			})
			.catch(function(){
				res.sendStatus(500)
			})
		}
	})
}