import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/SimulationRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/simulation', simulationRoutes);

// ✅ Required for Vercel (serverless handler)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


// ✅ Optional: Run locally only
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (process.argv[1] === __filename) {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}
