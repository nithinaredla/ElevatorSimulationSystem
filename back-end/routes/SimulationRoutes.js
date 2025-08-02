import express from 'express';
import {
  resetSimulation,
  addRequest,
  addBatchRequests,
  getSimulationState,
  getSimulationMetrics,
  pauseSimulation,
  resumeSimulation,
  simulationSpeed
} from '../controllers/SimulationController.js';

const router = express.Router();

router.post('/reset', resetSimulation);
router.post('/request', addRequest);
router.post('/requests', addBatchRequests);
router.get('/state', getSimulationState);
router.get('/metrics', getSimulationMetrics);
router.post('/pause', pauseSimulation);
router.post('/resume', resumeSimulation);
router.post('/speed', simulationSpeed);

export default router;
