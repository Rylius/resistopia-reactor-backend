const express = require('express');
const router = express.Router();

const simulation = require('../../simulation');

router.get('/simulation', (req, res) => {
    // TODO
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(simulation.state);
});

module.exports = router;
