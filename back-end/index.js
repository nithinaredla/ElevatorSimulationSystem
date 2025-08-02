import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/SimulationRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/simulation', simulationRoutes);

// Export for Vercel
export default (req, res) => {
  app(req, res);
};

// Run locally
if (require.main === module) {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}
