# direct-chat
A simple chat application using WebSockets.

## Usage
On the server, run
```
$ node app.js
```

On the client(s), open \<ip address of server\>:3000 in a browser. Enter a name in the 'Username' field, then click 'Connect.'

To run the server with HTTPS, set the environment variables SSL_CERT and SSL_KEY to the file paths of the certificate and
private key, respectively.
