var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000
	Pokemon = require('./api/manager/pokemonManager')
	bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);

app.listen(port);

