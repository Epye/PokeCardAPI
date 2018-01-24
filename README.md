# PokeCardAPI

faire un git clone 

installer node js (https://nodejs.org/en)

aller dans le dossier que tu viens de cloner

lancer npm install

lancer npm run start

l'adresse est ensuite localhost:3000


# Liste des routes de l'API : 

## AUTHENTIFICATION: 

### POST /login:
Route pour se connecter avec un compte.

Format attendu: 
{
	pseudo: String, 
	password: String
}

Format Retour: 
- si OK: 
{
	"idUser": String, 
	"pseudo": String, 
	"listePokemon": ArrayList<String>, 
	"listeCards": ArrayList<String>,
	"frinds": ArrayList<String>,
	"pokeCoin": Int,
	"picture": String,
	"idAccount": Int
}
- si Erreur : code 400

### POST /signup:
Route pour créer un compte.

Format attendu: 
{
	"pseudo": String, 
	"password": String
}

Format Retour: 
- si Ok: 
{
	"idUser": String, 
	"pseudo": String, 
	"listePokemon": ArrayList<String>, 
	"listeCards": ArrayList<String>,
	"frinds": ArrayList<String>,
	"pokeCoin": Int,
	"picture": String,
	"idAccount": Int
}
- si Pseudo déjà pris: code 400

### POST /verify:
Route pour se connecter via Google ou Facebook.url

Format attendu: 
{
	"idUser": String,
	"pseudo": String,
	"password": String,
	"profilePicture": String
}

Format Retour:
{
	"idUser": String, 
	"pseudo": String, 
	"listePokemon": ArrayList<String>, 
	"listeCards": ArrayList<String>,
	"frinds": ArrayList<String>,
	"pokeCoin": Int,
	"picture": String,
	"idAccount": Int
}

## USER:

### GET /user/:idUser/pokedex
Route pour récupérer la liste des pokemon d'un utilisateur

Format Retour si user existe:
[
{
	"id": Int,
	"name": String,
	"urlPicture": String
}
]

Format Retour si user n'exise pas:
{
	"user": false
}

### POST /user/addCard
Route pour ajouter des cartes à un utilisateur.

Format attendu: 
{
	"idUser": Int,
	"cards": [
	{
		"id": String,
		"idPokemon": String
	}
	]
}

Format Retour: 
{
	"idUser": String, 
	"pseudo": String, 
	"listePokemon": ArrayList<String>, 
	"listeCards": ArrayList<String>,
	"frinds": ArrayList<String>,
	"pokeCoin": Int,
	"picture": String,
	"idAccount": Int
}

### POST /user/removeCard 
Route pour supprimer des cartes à un utilisateur

Format attendu:
{
	"idUser": Int,
	"idCard": String
}
Format Retour: 
{
	"idUser": String, 
	"pseudo": String, 
	"listePokemon": ArrayList<String>, 
	"listeCards": ArrayList<String>,
	"frinds": ArrayList<String>,
	"pokeCoin": Int,
	"picture": String,
	"idAccount": Int
}

### GET /user/:idUser/:idPokemon/cards
Route pour récupérer les cartes de l'utilisateur d'un pokemon précis

Format Retour:
[{
	"id": String,
	"urlPictue": String,
	"price": Int
}]

### POST /user/:idUser/addFriend

Format attendu:
{
	"pseudoFriend": String
}

### GET /user/:idUser/getFriends

Format retour:
[{
	"idUser": String, 
	"pseudo": String, 
	"picture": String,
	"nbCartes": Int
}]

### DELETE /user/:idUser/delFriend

Format attendu:
{
	"pseudoFriend": String
}

## POKEMON:
### GET /pokedex
Route pour récupérer le pokedex.

Format Retour: 
[
{
	"id": Int,
	"name": String,
	"urlPicture": String
}
]

### GET /pokemon/:idPokemon
Route pour récupérer les informations d'un pokemon et ses cartes.

Format Retour:
{
	"id": Int,
	"name": String",
	"weight": Int,
	"height": Int,
	"urlPicture": Int,
	"cards": [
	{
		"id": String,
		"urlPicture": String,
		"price": Int
	}
	]
}

## CARDS :
### GET /cards/:idUser/booster
Route pour ouvrir un booster de 10 cartes

Format Retour:
{
	"idUser": String, 
	"pseudo": String, 
	"listePokemon": ArrayList<String>, 
	"listeCards": ArrayList<String>,
	"frinds": ArrayList<String>,
	"pokeCoin": Int,
	"picture": String,
	"idAccount": Int
}

### GET /cards/:idPokemon
Route pour récupérer toutes les cartes d'un pokémon

Format Retour:
{
	"id": String,
	"idPokemon": Int,
	"urlPicture": String
}

## EXCHANGE
### POST /exchange/send
Route pour envoyer une carte à un autre utilisateur

Format attendu:
{
	"idSender": Int,
	"idReceiver": Int,
	"idCard": String
}

Format Retour:
{
	"idUser": String, 
	"pseudo": String, 
	"listePokemon": ArrayList<String>, 
	"listeCards": ArrayList<String>,
	"frinds": ArrayList<String>,
	"pokeCoin": Int,
	"picture": String,
	"idAccount": Int
}

### GET /exchange/:idUser
Route pour récupérer tous les échanges que l'utilisateur a en cours

Format Retour:
{
	"idEchange": Int,
	"idSender": Int,
	"idReceiver": Int,
	"idCard": String,
	"stauts": String
}

## OPTION
### POST /option/editPseudo
Route pour éditer le pseudo d'un compte.

Format attendu: 
{
	"idUser": Int,
	"pseudo": String
}

### POST /option/verifyPseudo
Route pour vérifier si le pseudo existe déjà.

Format attendu: 
{
	"pseudo": String
}

Format Retour:
-s'il n'existe pas:
{
	"pseudo": false
}
-s'il existe : code 400

## QUIZZ
### POST /quizz/results
Route pour récupérer les gains du quizz
Format attendu:
{
	"idUser": Int,
	"score": Int,
} 

Format Retour:
{
	"pokeCoinsWin": Int,
	"cardsWin": [],
	"message": String,
	"img": "String"
}

# BD

CREATE TABLE `User` (
`idUser` int(255) unsigned NOT NULL AUTO_INCREMENT,
`pseudo` varchar(255) NOT NULL DEFAULT '',
`password` varchar(255) NOT NULL,
`listePokemon` longtext,
`listeCards` longtext,
`pokeCoin` int(11) DEFAULT '0',
`friends` varchar(255) DEFAULT '',
`picture` longtext,
`idAccount` varchar(255) DEFAULT NULL,
PRIMARY KEY (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
