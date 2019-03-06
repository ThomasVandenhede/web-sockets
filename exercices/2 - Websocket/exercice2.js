/**
  Un chat (discussion instantanée) basique utilisant le protocole WebSocket.
**/

/**
  I. Côté client : On doit pouvoir envoyer des messages au serveur et en recevoir du serveur après avoir affiché le document HTML.
  Vous utiliserez l'API JavaScript WebSocket du navigateur Internet documenté ici : https://developer.mozilla.org/fr/docs/Web/API/WebSocket

  1. Vous devez créer un document HTML contenant :
    - Un formulaire qui sera utilisé pour envoyer des messages. Ce formulaire (pour l'instant) ne contiendra qu'un champ texte.
    - Une <div> identifiée qui sera utilisée pour afficher la liste des messages.

  2. Au chargement du document, vous devez établir une connexion WebSocket avec un serveur WebSocket.

  3. À la soumission du formulaire vous devez envoyer le contenu du formulaire (le message) au serveur WebSocket. Pensez à empêcher le navigateur Internet de produire une requête HTTP à la soumission du formulaire.

  4. En cas de réception d'un message provenant du serveur WebSocket, vous l'ajouterez à la suite dans la <div> identifiée.
**/

/**
  II. Côté serveur : On doit pouvoir recevoir des messages provenant de n'importe quel client et les envoyer à tous les clients connectés.
  Vous utiliserez le module WebSocket documenté ici : https://www.npmjs.com/package/websocket

  1. Vous devez créer un serveur HTTP qui vous permettra d'envoyer le document HTML contenant le formulaire à des clients HTTP.

  2. Vous devez créer un serveur WebSocket qui, à la réception d'un message provenant d'un client WebSocket, envoi ce message à tous les clients WebSocket connectés.

  Pour pouvoir envoyer un message à tous les clients WebSocket connectés vous devez :
  - Avant de créer votre gestionnaire d'évènement qui gère une connexion, créer un tableau dans lequel vous sauvegarderez toutes les connexions WebSocket établies.
  - Dans votre gestionnaire d'évènement qui gère une connexion; après avoir établi une connexion WebSocket :
    -> sauvegarder cette nouvelle connexion dans le tableau prévu à cet effet;
    -> et enfin, boucler sur le tableau des connexions pour exécuter, pour chaque connexion, la méthode vous permettant d'envoyer le message dans cette connexion.
**/