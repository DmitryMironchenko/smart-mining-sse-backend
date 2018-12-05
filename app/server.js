import express from 'express';
import game from './Game/game';

let clientId = 0;
let clients = []; // <- Keep a map of attached clients
const template = `<!DOCTYPE html> 
<html> 
  <body>
    <script type="text/javascript">
      var source = new EventSource('/events/');
      source.onmessage = function(e) {
          document.body.innerHTML += e.data + "<br />";
      };
    </script> 
  </body> 
</html>`;

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, PATCH");
  next();
});

app.get('/', (req, res) => {
  res.send(template);
});
app.get('/events', (req, res) => {
  req.socket.setTimeout(Number.MAX_VALUE);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream', // <- Important headers
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  res.write('\n');
  (function (clientId) {
    clients[clientId] = res; // <- Add this client to those we consider "attached"
    req.on('close', function () {
      delete clients[clientId]
    }); // <- Remove this client when he disconnects
  })(++clientId)
});
// start the server
app.listen(3001, () => {
  console.log("+++ Express Server is Running");
});

const GAME_REFRESH_RATE = 2500;
game.spawnWaterPoint(1);
game.spawnCows(5);
game.startSpawningRandomEvents(30e2);

setInterval(() => {
  let data = null;
  if (true || Object.keys(clients).length) {
    data = game.render();
  }

  for (clientId in clients) {
    clients[clientId].write(`data: ${JSON.stringify(data)}\n\n`); // <- Push a message to a single attached client
  }
}, GAME_REFRESH_RATE);


