const express = require('express');
const router = express.Router();

const simulation = require('../../simulation');

router.get('/simulation', (req, res) => {
    // TODO
    res.contentType('application/json');
    res.send(simulation.state);
});

module.exports = router;
