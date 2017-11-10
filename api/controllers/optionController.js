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

module.pseudoController = function(req, res){
	console.log('/opion/editPseudo');
}