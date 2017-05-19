const express = require('express');
const router = express.Router();

router.ws('/frontend', (ws, req) => {
    ws.on('message', function (msg) {
        // TODO
        console.log(msg);
    });
});

module.exports = router;
