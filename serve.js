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

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);

app.listen(port);

