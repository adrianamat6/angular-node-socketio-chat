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

    // "nombre" -> "name", para que coincida con la interfaz ChatMessage del frontend
    socket.broadcast.emit('chat_message_server', {
        name: 'INFO',
        message: 'Se ha conectado un nuevo cliente'
    });

    // mismo nombre de evento que escucha el frontend ('clients_count')
    // y se manda el número real de clientes conectados
    io.emit('clients_count', io.engine.clientsCount);

    socket.on('chat_message', (data) => {
        io.emit('chat_message_server', data);
    });

    // hacía falta este listener para actualizar el contador al desconectarse alguien
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
        io.emit('clients_count', io.engine.clientsCount);
    });
});