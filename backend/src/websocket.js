const socketio = require('socket.io');

const calculateDistance = require('./Utils/calculateDIstance');
const connections = [];
let io;

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket =>{
        console.log(`New connection, id: ${socket.id}`);
        const { latitude, longitude, techs} = socket.handshake.query;
        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: techs.split(',').map(text => text.trim())
        })
    });
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection =>{
        return calculateDistance(coordinates, connection.coordinates) < 10 &&
        connection.techs.some(item => techs.includes(item));
    })
}

exports.sendMessage = (receivers, messageType, data ) => {
    receivers.map(connection => {
        io.to(connection.id).emit(messageType, data);
    })
    
}