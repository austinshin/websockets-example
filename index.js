const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// create websocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use('/', express.static('./client'));

// event handler for when a client connects to server
// ws refers to the client that send the message
wss.on('connection', (ws) => {
  // event handler for when a client sends a message to server
  ws.on('message', (message) => {
    console.log('received: %s', message);
    // ws.send sends message to specific client
    ws.send(JSON.stringify(`recieved ${message} from client`));

    // loops through all clients connected to the server
    // sends a message to all other clients when one client sends a message
    wss.clients.forEach((client) => {
      // if the client being iterated on isn't the one that send the message
      // send a message to that client
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify(`server recieved ${message} from another client`),
        );
      }
    });
  });
  ws.send('connected to server');
});

app.listen(3000, () => {
  console.log('express listening on 3000');
});

// used to launch websocket server
server.listen(8080, () => {
  console.log('Listening on %d', server.address().port);
});
