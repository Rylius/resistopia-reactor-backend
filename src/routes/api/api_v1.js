const express = require('express');
const router = express.Router();

const merge = require('deepmerge');

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

router.post('/globals', (req, res) => {
    const changes = req.body;
    if (!changes) {
        res.sendStatus(400);
        return;
    }

    simulation.state.globals = merge(simulation.state.globals, changes);

    res.sendStatus(200);
});

module.exports = router;
