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
 * Gestion de l'évènement 'upgrade' : correspond à une demande
 * d'établissement de connexion utilisant le protocole WebSocket.
 */
httpServer.on('upgrade', function(WebSocketRequest, socket, head) {

  console.log('Événement "upgrade".');

  /**
   * Création de la 'response handshake' : signale au client
   * que le passage au protocole WebSocket est accepté.
   */
  const secWebsocketKey = WebSocketRequest.headers['sec-websocket-key']; // clé envoyée par le navigateur.
  const webSocketProtocolGUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

  const crypto = require('crypto');
  const hash = crypto.createHash('sha1');
  hash.update(secWebsocketKey + webSocketProtocolGUID);
  const secWebSocketAccept = hash.digest('base64');

  const webSocketServerHeaders = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Protocol: diwjs',
    'Sec-WebSocket-Accept: ' + secWebSocketAccept
  ].concat('', '').join('\r\n') + '\r\n';

  socket.setTimeout(0);
  socket.setNoDelay(true);
  socket.setKeepAlive(true);

  // Envoi de la 'response handshake' au client.
  socket.write(webSocketServerHeaders, 'ascii');

  /**
   * Gestion l'évènement "data" : Cet évènement survient lorsque le serveur
   * WebSocket reçoit des données en provenance du client WebSocket.
   */
  socket.on('data', function(chunk) {
    // chunk : variable qui contient 1 "data frame" (page de données).

    /**
     * Décodage d'une page de données reçue.
     * ATTENTION : ceci ne fonctionne pas si la
     * donnée est fragmentée en plusieurs pages.
     */

    // Position par défaut du masque binaire.
    const maskLocation = 2;
    // Position par défaut du masque binaire.
    const maskingKey = chunk.slice(maskLocation, maskLocation + 4);
    // Tableau pour le stockage des données décodées.
    const decodedData = [];
    // Position par défaut des données.
    let dataLocation = maskLocation + 4;
    for (let i = 0; dataLocation < chunk.length; i++) {
      // Décodage octet par octet.
      decodedData.push(chunk[dataLocation] ^ maskingKey[i % 4]); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_XOR
      dataLocation++;
    };
    // Création d'un buffer (suite d'octets) à partir du tableau d'octets décodés.
    const buffer = Buffer.from(decodedData);
    // Conversion du buffer en chaîne de caractères.
    const message = buffer.toString();
    // Affichage du message dans la console.
    console.log(message);
  });

});

httpServer.listen(8888);
