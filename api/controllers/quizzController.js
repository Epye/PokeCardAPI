'use strict';
var _ = require('lodash');
var request = require("../manager/requestManager");

exports.category = function(req, res){
	console.log("/quizz/category");
	var url = "https://opentdb.com";
	var path = "/api_category.php";
	request.HTTPS(url, path, "GET")
	.then(function(response){
		res.json(response);
	})
}