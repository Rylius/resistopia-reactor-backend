const express = require('express');
const router = express.Router();

const simulation = require('../../simulation');

router.get('/simulation', (req, res) => {
    res.contentType('application/json');
    res.send(simulation.state);
});

router.get('/backups', (req, res) => {
    res.contentType('application/json');
    // TODO
    res.send([]);
});

module.exports = router;
