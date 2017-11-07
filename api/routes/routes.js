'use strict';
module.exports = function(app) {
	var pokemonController = require('../controllers/pokemonController');
	var authController = require('../controllers/authController');

	app.route('/pokedex').get(pokemonController.pokedex);

	app.route('/init/:userId').get(authController.init);

	app.route('/login').post(authController.login);

	app.route('/signup').post(authController.signup);

	app.route('/verify').post(authController.verify);

};