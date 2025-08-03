import { Simulation } from '../models/Simulation.js';

const sim = new Simulation(0,0); // Default


export const resetSimulation = (req, res) => {
  const { elevators, floors } = req.body;
  sim.reset(elevators, floors);
  sim.start();
  res.send('Simulation reset and started');
};

export const addRequest = (req, res) => {
  const { origin, destination } = req.body;
  sim.addRequest(origin, destination);
  res.send('Request added');
};

export const addBatchRequests = (req, res) => {
  const { requests } = req.body;
  requests.forEach(r => sim.addRequest(r.origin, r.destination, r.timestamp));
  res.send('Batch requests added');
};

export const getSimulationState = (req, res) => {
  res.json(sim.getState());
};

export const getSimulationMetrics = (req, res) => {
  res.json(sim.getMetrics());
};

export const pauseSimulation = (req, res) => {
  sim.pause();
  res.send('Simulation paused');
};

export const resumeSimulation = (req, res) => {
  sim.resume();
  res.send('Simulation resumed');
};

export const simulationSpeed = (req, res) => {
  const { multiplier } = req.body;
  sim.setSpeedMultiplier(multiplier);
  res.json({ message: `Speed set to ${multiplier}x` });
};
