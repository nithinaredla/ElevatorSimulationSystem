import axios from 'axios';
import fs from 'fs';
import chalk from 'chalk';
import cliProgress from 'cli-progress';

const BASE_URL = 'https://elevatorsimulationsystem-elevatorsimulationsystem.up.railway.app/api/simulation';
const TOTAL_REQUESTS = 100;
const BATCH_SIZE = 20;
const FLOORS = 10;

const logFile = 'stressTest.log';
fs.writeFileSync(logFile, '--- Stress Test Log ---\n\n'); // Start fresh

const log = (msg) => {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}\n`;
  fs.appendFileSync(logFile, line);
  console.log(line.trim());
};

// Generate a random request ensuring origin ≠ destination
const generateRequest = () => {
  let origin = Math.floor(Math.random() * FLOORS);
  let destination;
  do {
    destination = Math.floor(Math.random() * FLOORS);
  } while (destination === origin);
  return { origin, destination };
};

const runStressTest = async () => {
  console.log(chalk.blue('🚀 Starting stress test...\n'));

  const progressBar = new cliProgress.SingleBar({
    format: 'Progress |{bar}| {percentage}% | {value}/{total} requests',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  progressBar.start(TOTAL_REQUESTS, 0);
  const start = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += BATCH_SIZE) {
    const batch = Array.from({ length: BATCH_SIZE }, generateRequest);

    try {
      await axios.post(`${BASE_URL}/requests`, { requests: batch });
      log(`✅ Sent batch ${i / BATCH_SIZE + 1} (${batch.length} requests)`);
    } catch (error) {
      log(`❌ Failed to send batch ${i / BATCH_SIZE + 1}: ${error.message}`);
    }

    progressBar.increment(BATCH_SIZE);
  }

  progressBar.stop();
  const durationSec = ((Date.now() - start) / 1000).toFixed(2);
  log(`🏁 Stress test completed in ${durationSec} seconds`);
  console.log(chalk.green('\n✅ Done. See stressTest.log for detailed logs.\n'));
};

runStressTest();
