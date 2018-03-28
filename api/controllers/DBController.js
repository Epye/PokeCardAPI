var request = require('../manager/requestManager');
var mysql = require('mysql');
var fs = require('fs')
var base64 = require('base64-img')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pokecard'
});

exports.convertImageToBase64 = function (req, res) {
    console.log("/convert");

    var path = "./profilPictures";
    var retour = [];
    connection.query("DELETE FROM profilPicture", function (error, results, fields) {
        fs.readdir(path, (err, files) => {
            files.forEach(file => {
                retour.push(base64.base64Sync(path + "/" + file));
            });

            var query = "INSERT INTO profilPicture (base64) VALUES ";

            retour.forEach(function (data) {
                var tmpData = data.substring(22, data.length);
                var tmp = query + '("' + tmpData + '")';

                connection.query(tmp, function (error, results, fields) {});
            })
            res.sendStatus(200);
        })
    })
}

exports.initDB = function (req, res) {
    console.log("/initDB");

    var initUserDB = "CREATE TABLE `User` ( `idUser` int(255) unsigned NOT NULL AUTO_INCREMENT, `pseudo` varchar(255) NOT NULL DEFAULT '', `password` varchar(255) NOT NULL, `listePokemon` longtext, `listeCards` longtext,`pokeCoin` int(11) DEFAULT '500',`friends` longtext,`picture` longtext,`idAccount` varchar(255) DEFAULT NULL,`zipCode` varchar(255) NOT NULL DEFAULT '01000',PRIMARY KEY (`idUser`)) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;";
    var initExchangeDB = "CREATE TABLE `Exchange` (`idEchange` int(255) unsigned NOT NULL AUTO_INCREMENT,`idSender` int(255) NOT NULL,`idReceiver` int(11) DEFAULT NULL,`idCard` varchar(255) DEFAULT '',`status` varchar(255) DEFAULT NULL,`cardName` varchar(255) DEFAULT NULL,`cardPicture` varchar(255) DEFAULT NULL,PRIMARY KEY (`idEchange`)) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;";
    var initProfilPictureDB = "CREATE TABLE `profilPicture` (`base64` longtext NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    connection.query(initUserDB, function (err, result, fields) {
        connection.query(initExchangeDB, function (err, result, fields) {
            connection.query(initProfilPictureDB, function (err, result, fields) {
                request.HTTP("127.0.0.1", "/convert", "GET")
                    .then(function () {
                        res.sendStatus(200);
                    })
                    .catch(function () {
                        res.sendStatus(500)
                    })
            })
        })
    })
}