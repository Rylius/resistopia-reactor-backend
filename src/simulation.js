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

        simulation.state = Simulation.createInitialState(simulation.program);
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
