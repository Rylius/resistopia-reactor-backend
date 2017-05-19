const express = require('express');
const router = express.Router();

const frontend = require('../../frontend');

router.ws('/frontend', (ws, req) => {
    frontend.addWebSocket(ws);

    ws.on('error', () => {
        console.error(arguments);
    });

    ws.on('message', msg => {
        try {
            const message = JSON.parse(msg);
            frontend.handleMessage(ws, message);
        } catch (err) {
            // TODO
            console.error(err);
        }
    });

    ws.on('close', () => {
        frontend.removeWebSocket(ws);
    });
});

module.exports = router;
