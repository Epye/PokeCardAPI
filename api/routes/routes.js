'use strict';
module.exports = function(app) {
  	var pokemonController = require('../controllers/pokemonController');

	app.route('/test').get(pokemonController.test);

	app.route('/pokedex').get(pokemonController.pokedex);

	app.route('/init/:userId').get(pokemonController.init);

	app.route('/login').post(pokemonController.login);

};