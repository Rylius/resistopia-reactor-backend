const express = require('express');

const config = require('./config.json');

const app = express();

const expressWs = require('express-ws')(app, undefined, {
    perMessageDeflate: config.websockets.compression,
});

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

// Start simulation

const Simulation = require('resistopia-reactor-simulation');

const simulation = {
    program: Simulation.Program.Prototype(),
    state: null,
    intervalId: null,
    update: () => simulation.state = Simulation.update(simulation.program, simulation.state),
};

simulation.state = Simulation.createInitialState(simulation.program);
simulation.intervalId = setInterval(simulation.update, 1000);

// Start server

app.listen(config.server.port, () => {
    console.log('Server running');
});
