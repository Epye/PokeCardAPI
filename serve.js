var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000
	bodyParser = require('body-parser');

global.formatResponse = function(response){
	delete response.password;
	response.listeCards = formatArray(response.listeCards);
	response.listePokemon = formatArray(response.listePokemon);
	response.friends = formatArray(response.friends);
	return response;
}

global.formatArray = function(data){
	if(data == null){
		return [];
	}else{
		return data.split(",");
	}
}

global.price = function(rarity){
	if(rarity == "Common"){
		return 100;
	}else if (rarity == "Uncommon"){
		return 150;
	}else if (rarity == "Rare"){
		return 200;
	}else if (rarity == "Rare Holo"){
		return 250;
	}else if (rarity == "Rare Ultra"){
		return 300;
	}else if (rarity == "Rare Holo EX"){
		return 500;
	}else if (rarity == "Rare Holo Lv.X"){
		return 500;
	}else{
		return 400;
	}
}

global.formatVirgule = function(str){
	while(str.includes(",,")){
		str = str.replace(",,", ",");
	}
	return str;
}

global.PRICE_UNIT_CARD = 50;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);

app.listen(port);

