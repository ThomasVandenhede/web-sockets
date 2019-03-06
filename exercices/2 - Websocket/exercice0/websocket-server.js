/**
 * Le Serveur HTTP.
 * URL : http://[adresse IP/nom de domaine]:8888/
 *
 * Ce serveur produit une réponse HTTP contenant un document
 * HTML suite à une requête HTTP provenant d'un client HTTP.
 */

// Chargement du module HTTP.
const http = require('http');

// Création du serveur HTTP.
const httpServer = http.createServer();

/**
 * Gestion de l'évènement 'request' : correspond à la gestion
 * de la requête HTTP initiale permettant d'obtenir le fichier
 * HTML contenant le code JavaScript utilisant l'API WebSocket.
 */
httpServer.on('request', function(HttpRequest, HttpResponse) {
  console.log('Événement "request".');
  const fs = require('fs');
  // Le fichier HTML que nous utiliserons dans tous les cas.
  const filename = 'websocket-client.html';
  fs.readFile(filename, function(error, fileData) {
    if (error) {
      const responseBody = '<doctype html!><html><head><title>404 - Not Found</title></head><body><h1>404 - Not Found</h1><p>Page non trouvée</p></body></html>';
      HttpResponse.writeHead(404, {
        'Content-type': 'text/html; charset=UTF-8',
        'Content-length': Buffer.byteLength(responseBody)
      });
      HttpResponse.write(responseBody, function() {
        HttpResponse.end();
      });
    } else {
      HttpResponse.writeHead(200, {
        'Content-type': 'text/html; charset=UTF-8',
        'Content-length': fileData.length
      });
      HttpResponse.write(fileData, function() {
        HttpResponse.end();
      });
    }
  });
});

/**
 * Le Serveur WebSocket associé au serveur HTTP.
 * URL : ws://[adresse IP/nom de domaine]:8888/
 *
 * Ce serveur accepte une requête HTTP avec un en-tête upgrade et établit
 * une connexion persistante basée sur WebSocket.
 */

/**
 * On installe et on utilise le package websocket.
 * Documentation : https://www.npmjs.com/package/websocket
 */
const webSocket = require('websocket');

// On récupère une référence à la classe WebSocketServer.
const WebSocketServer = webSocket.server;
/**
 * La classe WebSocketServer est documentée ici :
 * https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketServer.md
 */

// On instancie la classe avec pour argument un référence à notre serveur HTTP.
const webSocketServer = new WebSocketServer({
  httpServer: httpServer
});

/**
 * Gestion de l'évènement "request" : correspond à la gestion
 * d'une requête WebSocket provenant d'un client WebSocket.
 */
webSocketServer.on('request', function(webSocketRequest) {

  /**
   * Objet de type WebSocketRequest documenté ici :
   * https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketRequest.md
   */
  const acceptedProtocol = 'diwjs'; // Doit correspondre au protocole définit côté client.
  const allowedOrigin = webSocketRequest.origin;

  /**
   * La méthode .accept() prend en argument :
   * - le nom du protocole autorisé pour les clients du serveur WebSocket
   * - l'origine autorisée des requêtes
   * La méthode .accept() retourne un objet de type WebSocketConnection documenté ici :
   * https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketConnection.md
   */

  const webSocketConnection = webSocketRequest.accept(acceptedProtocol, allowedOrigin);
  /**
   * À titre indicatif, côté client, l'utilisation de l'API WebSocket
   * devra être utilisée de la façon suivante :
   * var webSocketClient = new WebSocket('ws://[adresse IP/nom de domaine]:8888/', 'diwjs');
   */

  /**
   * Gestion de l'évènement 'message' : correspond à la gestion des messages
   * reçus par le serveur WebSocket en provenance du client WebSocket.
   */
  webSocketConnection.on('message', function(message) {
    /**
     * La variable message est un objet de la forme :
     * - Si le message est en UTF-8 : {type: 'utf8', utf8Data: 'le message reçu'}
     * - Si le message est un buffer : {type: 'binary', utf8Data: bufferDeDonneesBinaires}
     */

    // Affichage du message reçu dans la console.
    console.log(message);

    // Envoi d'un message au client WebSocket.
    webSocketConnection.sendUTF('Message bien reçu !');
  });
});

httpServer.listen(8080);
