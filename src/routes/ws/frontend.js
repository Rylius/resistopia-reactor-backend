const express = require('express');
const router = express.Router();

router.ws('/frontend', (ws, req) => {
    console.log('new ws frontend connection');

    ws.on('message', msg => {
        // TODO
        console.log(msg);
    });

    ws.on('close', () => {
        // TODO
        console.log('close');
    });
});

module.exports = router;
