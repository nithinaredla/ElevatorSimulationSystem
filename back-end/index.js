// Import required modules and packages
import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/SimulationRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create an Express app instance
const app = express();

// Enable CORS to allow requests from different origins
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register all simulation-related API routes under `/api/simulation`
app.use('/api/simulation', simulationRoutes);

// ✅ Primary entry point: This is for running on Vercel or Railway.
// Use the environment-defined PORT (for production) or fallback to 5000 locally.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// ✅ Optional block: Helps detect if this file is run directly with Node
// Useful during local development when using `node index.js`
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (process.argv[1] === __filename) {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
  });
}
