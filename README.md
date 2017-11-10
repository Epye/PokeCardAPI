# PokeCardAPI


faire un git clone 

installer node js (https://nodejs.org/en)

aller dans le dossier que tu viens de cloner

lancer npm install

lancer npm run start

l'adresse est ensuite localhost:3000


# Liste des routes de l'API : 

## Authentification: 

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
 	"listPokemon": String, 
 	"pokecoin": Int
 }
 - si Pseudo introuvalble: 
 {
 	pseudo: False
 }
 - si mauvais password: 
 {
 	password: False
 }

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
 	"listPokemon": String, 
 	"pokecoin": Int
 }
 - si Pseudo déjà pris: 
 {
 	"pseudo": false
 }

### POST /verify:
Route pour se connecter via Google ou Facebook.

Format attendu: 
{
	"idUser": String,
	"pseudo": String,
	"password": String,
	"profilePicture": String
}

Format Retour:
{
	"idUser": Int,
	"pseudo": String,
	"listPokemon": String,
	"pokecoin": Int
}

## Pokemon:

### GET /pokedex
Route pour récupérer le pokedex.

Format Retour: 
{ 
	"pokedex": [
		{
			"id": Int,
			"name": String,
			"urlPicture": String
		}
	]
}

### GET /pokemon/:idPokemon
Route pour récupérer les informations d'un pokemon et ses cartes.


