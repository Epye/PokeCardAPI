'use strict';
module.exports = function (app) {
	var pokemonController = require('../controllers/pokemonController');
	var cardsController = require('../controllers/cardsController');
	var exchangeController = require('../controllers/exchangeController');
	var authController = require('../controllers/authController');
	var optionController = require('../controllers/optionController');
	var userController = require('../controllers/userController');
	var quizzController = require('../controllers/quizzController');
	var weatherController = require('../controllers/weatherController');
	var chuckNorrisController = require('../controllers/chuckNorrisController');

	//AUTHENTIFICATION
	app.route('/login').post(authController.login);
	app.route('/signup').post(authController.signup);
	app.route('/verify').post(authController.verify);

	//USER
	app.route('/user/:idUser').get(userController.getUser);
	app.route('/user/:idUser/pokedex').get(userController.userPokedex);
	app.route('/user/:idUser/:idPokemon/cards').get(userController.getCardsPokemonUser);
	app.route('/user/:idUser/getFriends').get(userController.getFriends);
	app.route('/user/picture/list').get(userController.getListeProfilPicture);

	app.route('/user/addCard').post(userController.addCard);
	app.route('/user/addCardNFC').post(userController.addCardNFC);
	app.route('/user/:idUser/addFriend').post(userController.addFriend);
	app.route('/user/:idUser/delFriend').post(userController.delFriend);
	app.route('/user/addPokeCoins').post(userController.addPokeCoins);

	app.route('/user/removeCard').delete(userController.removeCard);

	//POKEMON
	app.route('/pokedex').get(pokemonController.pokedex);
	app.route('/pokemon/:idPokemon').get(pokemonController.pokemonDetails);

	//CARTES
	app.route('/cards/:idUser/booster/:nbCartes').get(cardsController.booster);
	app.route('/cards/:idPokemon').get(cardsController.cardsPokemon);
	app.route('/cards/list/boosters').get(cardsController.getBoosters);

	app.route('/cards/buy').post(cardsController.buyCards);
	app.route('/cards/sell').post(cardsController.sellCards);

	//EXCHANGES
	app.route('/exchange/:idReceiver').get(exchangeController.getExchange);

	app.route('/exchange/send').post(exchangeController.send);
	app.route('/exchange/add').post(exchangeController.add);

	app.route('/exchange/:idEchange').delete(exchangeController.remove);

	//QUIZZ
	app.route('/quizz/category').get(quizzController.category);
	app.route('/quizz/:quizzId').get(quizzController.quizz);

	app.route('/quizz/results').post(quizzController.results);

	//CHUCK NORRIS FACTS
	app.route('/chuckNorris/:idUser/random').get(chuckNorrisController.getChuckNorrisFact);

	//OPTION
	app.route('/option/editPseudo').post(optionController.editPseudo);
	app.route('/option/verifyPseudo').post(optionController.verifyPseudo);
	app.route('/option/editZipCode').post(optionController.editZipCode);
	app.route('/option/editProfilPicture').post(optionController.editProfilPicture);

	//WEATHER
	app.route('/weather/:idUser').get(weatherController.weather);

	app.route('/convert').get(optionController.convertImageToBase64);
};