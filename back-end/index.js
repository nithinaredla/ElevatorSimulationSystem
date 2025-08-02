import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/SimulationRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/simulation', simulationRoutes);

module.exports = app; // ✅ export for Vercel

// ✅ Only listen locally
if (require.main === module) {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}