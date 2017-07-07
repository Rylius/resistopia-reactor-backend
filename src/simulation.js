const Simulation = require('resistopia-reactor-simulation');

const simulation = {
    tickMilliseconds: 1000,
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
    },
    onUpdate: null,
};

module.exports = simulation;
