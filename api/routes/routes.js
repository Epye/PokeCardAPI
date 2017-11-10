'use strict';
module.exports = function(app) {
	var pokemonController = require('../controllers/pokemonController');
	var authController = require('../controllers/authController');
	var optionController = require('../controllers/optionController');

	//AUTHENTIFICATION
	app.route('/login').post(authController.login);
	app.route('/signup').post(authController.signup);
	app.route('/verify').post(authController.verify);

	//POKEMON
	app.route('/pokedex').get(pokemonController.pokedex);

	//CARTES

	//QUIZZ

	//OPTION
	app.route('/option/editpseudo').post(optionController.editPseudo);
};