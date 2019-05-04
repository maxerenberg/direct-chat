const messageForm = document.querySelector('#sending form');
const input = messageForm.querySelector('input');
const configForm = document.querySelector('#config form');
const messages = document.querySelector('#receiving ul');
const connMsg = document.getElementById('connMsg');
const websocketURL = (location.protocol === 'https:' ? 'wss://' : 'ws://') +
    location.host;

let username = null,
    socket = null;

messageForm.addEventListener('submit', ev => {
    ev.preventDefault(); // prevent page from reloading
    let msg = {
        from: username,
        val: input.value
    };
    socket.send(JSON.stringify(msg));
    addMessage(msg, true);
    input.value = '';
    return false;
});
configForm.addEventListener('submit', ev => {
    ev.preventDefault();
    username = document.getElementById('username').value;
    socket = new WebSocket(websocketURL);
    // connection opened
    socket.addEventListener('open', ev => {
        socket.send('PING');
    });
    // listen for messages
    socket.addEventListener('message', ev => {
        if (ev.data === 'PONG') {
            input.disabled = false;
            connMsg.innerHTML = "Connection established";
            connMsg.style.color = 'green';
        } else {
            try {
                addMessage(JSON.parse(ev.data), false);
            } catch (err) {
                console.error(err);
            }
        }
    });
    // print error message if connection fails
    socket.addEventListener('error', errorEvent => {
        connMsg.innerHTML =
            "Could not establish connection to " + websocketURL;
    });
    return false;
});

function addMessage(msg, ours) {
    let li = document.createElement('li');
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(htmlEscape(msg.val)));
    li.appendChild(document.createTextNode(htmlEscape(msg.from)));
    li.appendChild(div);
    li.className = ours ? 'ours' : 'theirs';
    messages.appendChild(li);
}

function htmlEscape(raw) {
    return raw
        .replace('&', '&amp')
        .replace('<', '&lt')
        .replace('>', '&gt')
        .replace('"', '&quot')
        .replace("'", '&#039');
}
