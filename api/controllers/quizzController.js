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

exports.results = function(req, res){
	console.log("/quizz/results");
	var idUser = req.body.idUser;
	var score = req.body.score;
	var pokeCoins = 0;
	var nbCards = 0;

	if(score >= 2){
		pokeCoins = score*15;

		if(score >= 5){
			nbCards = Math.floor(score/2);
		}

		request.HTTP('127.0.0.1', '/user/addPokeCoins', "POST", { "pokeCoins": pokeCoins, "idUser": idUser})
		.catch(function(error){
			res.sendStatus(500);
		})
		.then(function(response){
			if(nbCards > 0){
				return request.HTTP('127.0.0.1', '/cards/'+idUser+"/booster/"+nbCards, "GET");
			} else {
				return Promise.resolve({cards: []});
			}
		})
		.then(function(response){
			var tmpResponse = {
				"pokeCoinsWin": pokeCoins,
				"cardsWin": response.cards,
				"messageResult": messageResult(score),

			}
			console.log("TEST")
			res.json(response);
		})
	} else {

	}
}

var messageResult = function(score){
	if(score <= 2){
		return {
			"message": "Dommage, retente ta chance!",
			"img": "https://img.buzzfeed.com/buzzfeed-static/static/2014-12/26/14/enhanced/webdr02/anigif_enhanced-6904-1419620840-2.gif?downsize=715:*&output-format=auto&output-quality=auto"
		}
	}else if (score <= 4){
		return {
			"message": "Entraîne-toi encore un peu pour viser la moyenne!",
			"img": "https://i.amz.mshcdn.com/NBu6RW3fnM1y2ChAQNI09IVOHRw=/fit-in/850x850/http%3A%2F%2Fmashable.com%2Fwp-content%2Fgallery%2Flessons-pokemon-can-teach-you-about-friendship%2Fdancing.gif"
		}
	} else if (score < 7){
		return {
			"message": "Pas mal!",
			"img": "https://media.giphy.com/media/10LKovKon8DENq/giphy.gif"
		}
	} else if (score < 9){
		return {
			"message": "Hey, c'était bien joué!",
			"img": "https://static.tumblr.com/c52263710e2e2cde1c25b07bf4c38553/rzmhryw/lbgot6vy3/tumblr_static_tumblr_static_butalms09ao8ww4gog8gc4kos_640.gif"
		}
	} else if (score < 10){
		return {
			"message": "Presque parfait",
			"img": "https://media.giphy.com/media/slVWEctHZKvWU/giphy.gif"
		}
	} else {
		var img = "https://data.photofunky.net/output/image/9/e/9/7/9e9727/photofunky.gif";
		if(Math.random()*100 <= 10){
			img = "http://4.bp.blogspot.com/-sHVLTuc27BA/Vd3UAQpKaYI/AAAAAAAACV0/j1UVgQ76KSA/s400/pokemon10.gif";
		}
		return {
			"message": "Bravo! Tu es un maître dans ce domaine!",
			"img": img
		}
	}
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

