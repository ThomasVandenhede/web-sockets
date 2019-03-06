#!/usr/bin/env node
const WebSocketServer = require("websocket").server;
const http = require("http");
const db = require("./db");

function addMessage(message) {
  return new Promise((resolve, reject) => {
    db.connect(function(db) {
      client
        .db("ws-chat")
        .collection("messages")
        .insertOne(
          {
            content: (function() {
              if (message.type === "utf8") {
                return message.utf8Data;
              } else if (message.type === "binary") {
                return message;
              }
            })()
          },
          function(err, docs) {
            client.close();
            if (err) {
              reject(err);
            } else {
              resolve(docs);
            }
          }
        );
    });
  });
}

function fetchMessages() {
  return new Promise((resolve, reject) => {
    db.connect(function(client) {
      const dbInstance = client.db("ws-chat");

      dbInstance
        .collection("messages")
        .find({})
        .toArray((err, docs) => {
          if (err) reject(err);
          client.close();
          resolve(docs);
        });
    });
  });
}

let connections = [];
const state = {
  client: null
};

const server = http.createServer(function(request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function() {
  console.log(new Date() + " Server is listening on port 8080");
});

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  const connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " Connection accepted.");

  connections.push(connection);
  fetchMessages().then(res => {
    const responseMessage = JSON.stringify(res);

    connections.forEach(conn => {
      conn.sendUTF(responseMessage);
    });
  });

  connection.on("message", function(message) {
    addMessage(message)
      .then(res => fetchMessages())
      .then(messages => {
        const responseMessage = JSON.stringify(messages);

        connections.forEach(conn => {
          conn.sendUTF(responseMessage);
        });
      });
  });

  connection.on("close", function(reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
