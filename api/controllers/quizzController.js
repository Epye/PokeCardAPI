'use strict';
var _ = require('lodash');
var request = require("../manager/requestManager");

exports.category = function(req, res){
	console.log("/quizz/category");
	var url = "https://opentdb.com";
	var path = "/api_category.php";
	request.HTTPS(url, path, "GET")
	.then(function(response){
		var tmpResponse = response.trivia_categories;
		var categoryToDelete = [{
			"id": 10,
			"name": "Entertainment: Books"
		},
		{
			"id": 13,
			"name": "Entertainment: Musicals & Theatres"
		},
		{
			"id": 16,
			"name": "Entertainment: Board Games"
		},
		{
			"id": 20,
			"name": "Mythology"
		},
		{
			"id": 25,
			"name": "Art"
		},
		{
			"id": 26,
			"name": "Celebrities"
		},
		{
			"id": 29,
			"name": "Entertainment: Comics"
		},
		{
			"id": 30,
			"name": "Science: Gadgets"
		},
		{
			"id": 32,
			"name": "Entertainment: Cartoon & Animations"
		}
		]
		_.pullAllWith(tmpResponse, categoryToDelete, _.isEqual);
		res.json(tmpResponse);
	})
}

exports.quizz = function(req, res){
	var quizzId = req.params.quizzId;
	console.log("/quizz/" + quizzId);
	var url = "https://opentdb.com";
	var path = "/api.php?amount=10&category=" + quizzId + "&type=boolean";
	request.HTTPS(url, path, "GET")
	.then(function(response){
		var tmpResponse = [];
		response.results.forEach(function(result){
			tmpResponse.push({
				"question": convertSpecialCharacter(result.question),
				"correct": result.correct_answer
			});
		})
		res.json(tmpResponse);
	})
}

var convertSpecialCharacter = function(str){
	while(str.includes("&#039;")){
		str = str.replace("&#039;", "'");
	}
	while(str.includes("&quot;")){
		str = str.replace("&quot;", "\"");
	}
	return str;
} 

