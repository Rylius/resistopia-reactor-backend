const express = require('express');
const log4js = require('log4js');

const config = require('./config.json');
try {
    log4js.configure(config.log4js);
} catch (error) {
    log4js.configure({
        appenders: {console: {type: 'console'}},
        categories: {default: {appenders: ['console'], level: 'trace'}},
    });
}

const log = log4js.getLogger('app');

process.on('uncaughtException', (err) => {
    log.fatal('Uncaught exception', err);
    log4js.shutdown(() => process.exit(1));
});

function shutdownListener() {
    log.info('Server shutting down');
    log4js.shutdown();
}

process.on('SIGINT', shutdownListener);
process.on('SIGTERM', shutdownListener);
process.on('SIGHUP', shutdownListener);

// Ensure backup directories exist

const fs = require('fs');

if (fs.accessSync(config.backup.directories.temporary, fs.constants.R_OK | fs.constants.W_OK)) {
    log.error('Temporary backup directory "%s" does not exist, backups will fail', config.backup.directories.temporary);
}
if (fs.accessSync(config.backup.directories.persistent, fs.constants.W_OK)) {
    log.error('Persistent backup directory "%s" does not exist, backups will fail', config.backup.directories.persistent);
}

// Set up express

const app = express();

app.enable('trust proxy');

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
    log.info('Server running');
});
