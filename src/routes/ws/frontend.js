const express = require('express');
const router = express.Router();

const log = require('log4js').getLogger('websocket');

const frontend = require('../../frontend');

router.ws('/frontend', (ws, req) => {
    const clientInfo = req.ip + ':' + req.connection.remotePort;

    log.debug('%s: New frontend connection', clientInfo);
    frontend.addWebSocket(ws);

    ws.on('error', () => {
        // TODO
        log.error(arguments);
    });

    ws.on('message', msg => {
        try {
            const message = JSON.parse(msg);
            frontend.handleMessage(ws, message);
        } catch (err) {
            // TODO
            log.error('%s: Failed to parse message', clientInfo, err);
        }
    });

    ws.on('close', () => {
        frontend.removeWebSocket(ws);
        log.debug('%s: Closed frontend connection', clientInfo);
    });
});

module.exports = router;
