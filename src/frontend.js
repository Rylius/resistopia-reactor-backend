const WebSocket = require('ws');
const merge = require('deepmerge');

const simulation = require('./simulation');

const webSockets = [];

function addWebSocket(ws) {
    webSockets.push(ws);
}

function removeWebSocket(ws) {
    webSockets.splice(webSockets.indexOf(ws), 1);
}

function broadcast(type, data) {
    webSockets.forEach(ws => {
        if (ws.readyState !== WebSocket.OPEN) {
            return;
        }

        ws.send(JSON.stringify({type, data}));
    });
}

function broadcastStateUpdate(state) {
    broadcast('state', state.stateMachines);
}

function handleMessage(ws, message) {
    switch (message.type) {
        case 'change-state':
            // TODO
            simulation.state.stateMachines = merge(simulation.state.stateMachines, message.data);
            break;
        default:
            // TODO
            console.warn(`Unknown message type "${message.type}"`);
            return;
    }
}

module.exports = {
    addWebSocket,
    removeWebSocket,
    broadcastStateUpdate,
    handleMessage,
};
