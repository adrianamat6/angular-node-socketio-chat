const http = require('node:http');
const socketIO = require('socket.io');

// Load .env
require('dotenv').config();

const server = http.createServer((req, res) => res.end('Funciona OK!'));

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// SOCKET SERVER
const io = socketIO(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un nuevo cliente');

    socket.on('chat_message', (data) => {
        io.emit('chat_message_server', data);
    });
});