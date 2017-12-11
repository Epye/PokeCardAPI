'use strict';
module.exports = function(app) {
	var pokemonController = require('../controllers/pokemonController');
	var cardsController = require('../controllers/cardsController');
	var announceController = require('../controllers/announceController');
	var authController = require('../controllers/authController');
	var optionController = require('../controllers/optionController');
	var userController = require('../controllers/userController');

	//AUTHENTIFICATION
	app.route('/login').post(authController.login);
	app.route('/signup').post(authController.signup);
	app.route('/verify').post(authController.verify);

	//USER
	app.route('/user/addCard').post(userController.addCard);
	app.route('/user/:idUser/pokedex').get(userController.userPokedex);
	app.route('/user/:idUser/pokemon/cards').get(userController.getCardsPokemonUser);

	//POKEMON
	app.route('/pokedex').get(pokemonController.pokedex);
	app.route('/pokemon/:idPokemon').get(pokemonController.pokemonDetails);

	//CARTES
	app.route('/cards/:idUser/booster').get(cardsController.booster);
	app.route('/cards/:idPokemon').get(cardsController.cardsPokemon);

	//ANNONCES
	app.route('/announce/add').post(announceController.addAnnounce);

	//QUIZZ

	//OPTION
	app.route('/option/editPseudo').post(optionController.editPseudo);
	app.route('/option/verifyPseudo').post(optionController.verifyPseudo);
};