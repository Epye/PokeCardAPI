'use strict';
module.exports = function(app) {
  	var pokemonController = require('../controllers/pokemonController');

	app.route('/test').get(pokemonController.test);

};