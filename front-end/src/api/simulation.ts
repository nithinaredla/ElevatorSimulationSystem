import axios from 'axios';

const BASE_URL = 'https://elevatorsimulationsystem-elevatorsimulationsystem.up.railway.app/api/simulation';

// Reset the simulation with specified elevators and floors
export const resetSimulation = (elevators: number, floors: number) => {
  return axios.post(`${BASE_URL}/reset`, { elevators, floors });
};

// Get the current state of the simulation
export const getSimulationState = () => {
  return axios.get(`${BASE_URL}/state`);
};

// Resume the simulation
export const resumeSimulation = () => {
  return axios.post(`${BASE_URL}/resume`);
};

// Pause the simulation
export const pauseSimulation = () => {
  return axios.post(`${BASE_URL}/pause`);
};

// Add a single request (origin and destination)
export const addRequest = (origin: number, destination: number) => {
  return axios.post(`${BASE_URL}/request`, { origin, destination });
};

// Add multiple requests at once
export const addBulkRequests = (requests: { origin: number; destination: number }[]) => {
  return axios.post(`${BASE_URL}/requests`, { requests });
};


// Get performance metrics of the simulation
export const getMetrics = () => {
  return axios.get(`${BASE_URL}/metrics`);
};

// Change the speed multiplier of the simulation
export const handleSpeedChange = (speed: number) => {
  return axios.post(`${BASE_URL}/speed`, { multiplier: speed });
};
