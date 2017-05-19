const express = require('express');

const config = require('./config.json');

const app = express();

const expressWs = require('express-ws')(app, undefined, {
    perMessageDeflate: config.websockets.compression,
});

const simulation = require('./src/simulation');

const frontend = require('./src/frontend');

// Register routes

const apiRoutes = {
    '/api/v1/': require('./src/routes/api/api_v1'),
};
Object.keys(apiRoutes).forEach(route => {
    app.use(route, apiRoutes[route]);
});

app.use('/ws/', require('./src/routes/ws/frontend'));

app.use((req, res) => {
    res.sendStatus(404);
});

// Start server

simulation.onUpdate = () => {
    frontend.broadcastStateUpdate(simulation.state);
};
simulation.start();

app.listen(config.server.port, () => {
    console.log('Server running');
});
