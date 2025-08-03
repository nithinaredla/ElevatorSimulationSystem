import { Elevator } from './Elevator.js';

export class Simulation {
  constructor(numElevators, numFloors) {
    this.numElevators = numElevators;
    this.numFloors = numFloors;
    this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i, numFloors));
    this.requests = [];
    this.completed = [];
    this.interval = null;
    this.intervalTime = 2000;
    this.running = false;
    this.tick = 0;
  }

  start() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), this.intervalTime);
    this.running = true;
  }

  pause() {
    if (this.interval) clearInterval(this.interval);
    this.running = false;
  }

  resume() {
    if (!this.running) this.start();
  }

  reset(numElevators = this.numElevators, numFloors = this.numFloors) {
    this.pause();
    this.numElevators = numElevators;
    this.numFloors = numFloors;
    this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i, numFloors));
    this.requests = [];
    this.completed = [];
    this.tick = 0;
  }

  setSpeedMultiplier(multiplier) {
    this.intervalTime = 2000 / multiplier;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = setInterval(() => this.step(), this.intervalTime);
    }
  }

  step() {
    const now = Date.now();

    this.handleMorningRush();
    this.dispatchRequests(now);
    this.updateElevators();
    this.requests = this.requests.filter(r => !r.droppedAt);
    this.tick++;
  }

  handleMorningRush() {
    const currentHour = new Date().getHours();
    const isMorning = currentHour === 9;

    if (!isMorning) return;

    this.elevators.forEach(elevator => {
      if (elevator.state === 'idle' && elevator.floor !== 0 && !elevator.queue.includes(0)) {
        elevator.addRequest(0);
        console.log(`🌞 [Morning Rush] Elevator ${elevator.id} returning to Floor 0`);
      }
    });
  }

  dispatchRequests(now) {
    const AGING_THRESHOLD = 30000;

    const aged = this.requests.filter(r => !r.assignedAt && now - r.timestamp > AGING_THRESHOLD);
    const fresh = this.requests.filter(r => !r.assignedAt && now - r.timestamp <= AGING_THRESHOLD);

    const assignToBest = (req, isAged = false) => {
      const best = this.elevators.reduce((best, curr) => {
        const currScore = Math.abs(curr.floor - req.origin) + curr.queue.length * 2;
        const bestScore = Math.abs(best.floor - req.origin) + best.queue.length * 2;
        return currScore < bestScore ? curr : best;
      });

      if (!best.queue.includes(req.origin)) {
        best.addRequest(req.origin);
        console[isAged ? 'warn' : 'log'](
          `${isAged ? '⚠️ [AGING]' : '📥'} Request ${req.origin}→${req.destination} assigned to Elevator ${best.id}`
        );
      }

      req.assignedAt = now;
      req.elevatorId = best.id;
    };

    aged.forEach(req => assignToBest(req, true));
    fresh.forEach(req => assignToBest(req, false));
  }

  updateElevators() {
    console.log(`== Tick ${this.tick} | Time: ${this.tick * this.intervalTime / 1000}s ==`);
    this.elevators.forEach(elevator => {
      console.log(`E${elevator.id} | Floor: ${elevator.floor} | State: ${elevator.state} | Queue: [${elevator.queue.join(', ')}]`);
      elevator.step();

      this.requests.forEach(req => {
        if (
          req.elevatorId === elevator.id &&
          req.origin === elevator.floor &&
          elevator.doorOpen &&
          !req.pickedUp
        ) {
          req.pickedUp = true;
          req.pickedUpAt = Date.now();
          if (!elevator.queue.includes(req.destination)) {
            elevator.addRequest(req.destination);
          }
        }

        if (
          req.elevatorId === elevator.id &&
          req.destination === elevator.floor &&
          elevator.doorOpen &&
          req.pickedUp &&
          !req.droppedAt
        ) {
          req.droppedAt = Date.now();
          this.completed.push(req);
        }
      });
    });
  }

  addRequest(origin, destination) {
    const req = {
      origin,
      destination,
      timestamp: Date.now(),
      assignedAt: null,
      pickedUp: false,
      pickedUpAt: null,
      droppedAt: null,
      elevatorId: null
    };
    console.log('📨 New request added:', req);
    this.requests.push(req);
  }

  getState() {
    return {
      elevators: this.elevators.map(e => e.getState()),
      pendingRequests: [...this.requests],
      numElevators: this.numElevators,
      numFloors: this.numFloors
    };
  }

  getMetrics() {
    const waitTimes = [];
    const travelTimes = [];

    this.completed.forEach(req => {
      if (req.pickedUpAt && req.timestamp) waitTimes.push((req.pickedUpAt - req.timestamp) / 1000);
      if (req.droppedAt && req.pickedUpAt) travelTimes.push((req.droppedAt - req.pickedUpAt) / 1000);
    });

    const avg = arr => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    return {
      totalRequests: this.completed.length,
      averageWaitTimeSec: Number(avg(waitTimes).toFixed(2)),
      averageTravelTimeSec: Number(avg(travelTimes).toFixed(2)),
      averageFulfillmentTimeSec: Number(avg([...waitTimes, ...travelTimes]).toFixed(2))
    };
  }
}
