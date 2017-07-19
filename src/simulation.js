const log = require('log4js').getLogger('simulation');

const merge = require('deepmerge');
const Simulation = require('resistopia-reactor-simulation');
const backup = require('./backup');

const simulation = {
    tickMilliseconds: 1000,
    ticksBetweenTemporaryBackups: 60, // 1 minute
    ticksBetweenPersistentBackups: 3600, // 1 hour
    program: Simulation.Program.BE13,
    state: null,
    intervalId: null,
    start() {
        simulation.stop();

        log.info('Setting up simulation state...');
        const initialState = Simulation.createInitialState(simulation.program);
        try {
            // Merge onto the initial state to make sure new state machines are being added
            simulation.state = merge(initialState, backup.restoreLatest());
            log.info('Loaded backup file');
        } catch (err) {
            simulation.state = initialState;
            log.info('No backup file found, using initial state', err);
        }

        simulation.intervalId = setInterval(simulation.update, simulation.tickMilliseconds);
    },
    stop() {
        if (simulation.intervalId) {
            clearInterval(simulation.intervalId);
            simulation.intervalId = null;
        }
    },
    update() {
        simulation.state = Simulation.update(simulation.program, simulation.state);

        if (simulation.onUpdate) {
            simulation.onUpdate(simulation);
        }

        if (simulation.state.tick % simulation.ticksBetweenTemporaryBackups === 0) {
            backup.saveTemporary(simulation.state);
        }
        if (simulation.state.tick % simulation.ticksBetweenPersistentBackups === 0) {
            backup.savePersistent(simulation.state);
        }
    },
    onUpdate: null,
};

module.exports = simulation;
