// Import required modules
import express from 'express';

// Import all the controller functions for the simulation
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

// Create an Express router instance
const router = express.Router();

/**
 * POST /reset
 * Resets the simulation with new elevator and floor settings.
 */
router.post('/reset', resetSimulation);

/**
 * POST /request
 * Adds a single elevator request (origin -> destination).
 */
router.post('/request', addRequest);

/**
 * POST /requests
 * Adds multiple elevator requests in a batch.
 */
router.post('/requests', addBatchRequests);

/**
 * GET /state
 * Returns the current state of the simulation.
 */
router.get('/state', getSimulationState);

/**
 * GET /metrics
 * Returns performance metrics of the simulation (e.g., average wait time).
 */
router.get('/metrics', getSimulationMetrics);

/**
 * POST /pause
 * Pauses the simulation.
 */
router.post('/pause', pauseSimulation);

/**
 * POST /resume
 * Resumes a paused simulation.
 */
router.post('/resume', resumeSimulation);

/**
 * POST /speed
 * Sets the simulation speed multiplier (e.g., 1x, 2x, 5x).
 */
router.post('/speed', simulationSpeed);

// Export the router to be used in the main server file
export default router;
