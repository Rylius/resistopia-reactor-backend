const Simulation = require('resistopia-reactor-simulation');

const simulation = {
    program: Simulation.Program.Prototype(),
    state: null,
    intervalId: null,
    start() {
        simulation.stop();

        simulation.state = Simulation.createInitialState(simulation.program);
        simulation.intervalId = setInterval(simulation.update, 1000);
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
