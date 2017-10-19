'use strict';
var https = require('https');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pokecard'
});


connection.connect();

exports.test = function(req, res){
	res.json({test: "test"});
}

exports.pokedex = function(req, res){

	var options = "https://pokeapi.co/api/v2/pokedex/1/";

	var data = "";

	var request = https.get(options, (result) => {
	  	result.on('data', (d) => {
	  	 	data += d;
	  	});
	  	result.on('end', function(){
	  		res.json(JSON.parse(data));
	  	});
	});

	request.on('error', (e) => {
	  console.error(e);
	});

	request.end();
}

exports.init = function(req, res){
	var userId = req.params.userId;

	connection.connect();

	var response = {};
 
	connection.query('SELECT * FROM User WHERE idUser =' + userId, function (error, results, fields) {
	  	response = results[0];
	  	
		res.json(response);
	});
}

exports.login = function(req, res){
	var mail = req.body.mail;

	var response = {};
 
	connection.query('SELECT * FROM User WHERE mail LIKE "' + mail + '"', function (error, results, fields) {
	  	if(results){
	  		res.json(results[0]);
	  	}else{
	  		res.json({user: false});
	  	}
	});
}