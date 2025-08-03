import axios from 'axios';

const BASE_URL = 'https://elevatorsimulationsystem-elevatorsimulationsystem.up.railway.app/api/simulation';


export const resetSimulation = (elevators: number, floors: number) => {
  return axios.post(`${BASE_URL}/reset`, { elevators, floors });
};


export const getSimulationState = () => {
  return axios.get(`${BASE_URL}/state`);
};

export const addRequest = (origin: number, destination: number) => {
  return axios.post(`${BASE_URL}/request`, { origin, destination });
};

export const addBulkRequests = (requests: { origin: number; destination: number }[]) => {
  return axios.post(`${BASE_URL}/requests`, { requests });
};

export const getMetrics = () => {
  return axios.get(`${BASE_URL}/metrics`);
};

export const handleSpeedChange = (speed: number) => {
  axios.post(`${BASE_URL}/speed`, { multiplier: speed });
};

