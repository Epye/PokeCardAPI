'use strict';
module.exports = function(app) {
	var pokemonController = require('../controllers/pokemonController');
	var cardsController = require('../controllers/cardsController');
	var exchangeController = require('../controllers/exchangeController');
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
	app.route('/user/:idUser/:idPokemon/cards').get(userController.getCardsPokemonUser);
	app.route('/user/:idUser/addFriend').post(userController.addFriend);

	//POKEMON
	app.route('/pokedex').get(pokemonController.pokedex);
	app.route('/pokemon/:idPokemon').get(pokemonController.pokemonDetails);

	//CARTES
	app.route('/cards/:idUser/booster').get(cardsController.booster);
	app.route('/cards/:idPokemon').get(cardsController.cardsPokemon);

	//EXCHANGES
	app.route('/exchange/send').post(exchangeController.send);
	app.route('/exchange/add').post(exchangeController.add);
	app.route('/exchange/:idEchange').delete(exchangeController.remove);

	//QUIZZ

	//OPTION
	app.route('/option/editPseudo').post(optionController.editPseudo);
	app.route('/option/verifyPseudo').post(optionController.verifyPseudo);
};