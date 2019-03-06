/**
  Un chat (discussion instantanée) amélioré utilisant le protocole WebSocket.

  Le chat réalisé précédemment peut être amélioré en faisant en sorte que :
  - La liste de tous les messages précédemment envoyés soit affichée au chargement du document HTML (nécessitera une base de données);
  - On puisse envoyer son pseudonyme en plus du message au serveur WebSocket (nécessitera d'utiliser le format d'objet sérialisé JSON).
**/

/**
  I. Côté client : On doit pouvoir afficher le document HTML contenant la liste de tous les messages envoyés précédemment et envoyer des messages au serveur et en recevoir du serveur à n'importe quel moment.
  Vous utiliserez l'API JavaScript WebSocket du navigateur Internet documenté ici : https://developer.mozilla.org/fr/docs/Web/API/WebSocket

  1. Vous devez créer un document HTML contenant :
    - Un formulaire qui sera utilisé pour envoyer des messages. Ce formulaire contient un champ pseudonyme et un champ texte.
    - Une <div> identifiée qui sera utilisée pour afficher la liste des messages.

  2. Au chargement du document, vous devez établir une connexion WebSocket avec un serveur WebSocket.

  3. À la soumission du formulaire vous devez envoyer le contenu du formulaire (le pseudonyme et le message) au serveur WebSocket. Pensez à empêcher le navigateur Internet de produire une requête HTTP à la soumission du formulaire.

  Vous devrez envoyer ces informations au serveur WebSocket sous forme d'objet JavaScript sérialisé (transformé en chaîne de caractère JSON). Pour convertir un objet JavaScript chaîne de caractère vous utiliserez l'objet fondamental de JavaScript JSON (documenté ici : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/JSON)

  4. Les messages reçus, provenant du serveur WebSocket, seront des chaînes de caractères représentant des objets JavaScript sérialisés. Vous devrez les convertir en objet toujours en utilisant l'objet fondamental JSON. Puis vous utiliserez les informations contenues dans cet objet pour ajouter le pseudonyme et le message à la suite dans la <div> identifiée.
**/

/**
  II. Côté serveur : On doit pouvoir recevoir des messages provenant de n'importe quel client, les sauvegarder en base de données, et les envoyer à tous les clients connectés.
  Vous utiliserez le module WebSocket documenté ici : https://www.npmjs.com/package/websocket

  1. Vous devez créer un serveur HTTP qui vous permettra d'envoyer le document HTML contenant :
  - le formulaire;
  - la liste des messages provenant d'une collection dans une base de données MongoDB;
  à des clients HTTP.

  2. Vous devez créer un serveur WebSocket qui, à la réception d'un message provenant d'un client WebSocket :
  - dé-sérialise le message (vous utiliserez l'objet fondamental de JavaScript JSON);
  - l'enregistre dans une collection dans une base de données MongoDB;
  - envoi ce message à tous les clients WebSocket connectés.

  Pour pouvoir envoyer un message à tous les clients WebSocket connectés vous devez :
  - Avant de créer votre gestionnaire d'évènement qui gère une connexion, créer un tableau dans lequel vous sauvegarderez toutes les connexions WebSocket établies.
  - Dans votre gestionnaire d'évènement qui gère une connexion; après avoir établi une connexion WebSocket :
    -> sauvegarder cette nouvelle connexion dans le tableau prévu à cet effet;
    -> et enfin, boucler sur le tableau des connexions pour exécuter pour chaque connexion la méthode vous permettant d'envoyer le message dans cette connexion.
**/