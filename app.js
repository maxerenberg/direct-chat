const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const websocket = require('ws');
const PORT = 3000;

let app = express();
let server = null;
if (process.env.SSL_CERT && process.env.SSL_KEY) {
    let options = {
        cert: fs.readFileSync(process.env.SSL_CERT).toString(),
        key: fs.readFileSync(process.env.SSL_KEY).toString()
    }
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}

app.use((req, res, next) => {
    console.log(new Date().toISOString() + ' ' +
        req.socket.remoteAddress + ' ' + req.method + ' ' + req.url);
    next();
});
app.use(express.static('public'));

let wss = new websocket.Server({server});
wss.on('connection', socket => {
    console.log('connected');
    socket.on('message', msg => {
        console.log('received: %s', msg);
        if (msg === 'PING') {
            socket.send('PONG');
            return;
        }
        // broadcast to everyone except the current client
        wss.clients.forEach(client => {
            if (client !== socket && client.readyState === websocket.OPEN) {
                client.send(msg);
            }
        });
    });
    socket.on('close', (code, reason) => {
        console.log('disconnected: ' + reason);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
