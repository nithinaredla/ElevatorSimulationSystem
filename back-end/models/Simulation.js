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

    reset(numElevators, numFloors) {
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

    getDispatchScore(elevator, request) {
        // Ideal: elevator moving toward request and in same direction
        if (elevator.state === 'idle') return 0;

        const sameDirection =
            (elevator.direction === 'up' && request.origin >= elevator.floor) ||
            (elevator.direction === 'down' && request.origin <= elevator.floor);

        return sameDirection
            ? Math.abs(elevator.floor - request.origin)
            : Infinity; // avoid wrong-direction elevators
    }
    scoreElevatorForRequest(elevator, request, currentTime) {
        let score = 0;

        // Penalize elevators with longer queues
        score += elevator.queue.length * 10;

        // Distance from elevator to request origin
        score += Math.abs(elevator.currentFloor - request.origin) * 5;

        // Bonus: if idle
        if (elevator.state === 'idle') score -= 10;

        // Bonus aging priority
        const age = currentTime - request.timestamp;
        score -= Math.floor(age / 1000); // 1 point per second waited

        return score;
    }

    step() {
        const now = Date.now();
        // Time-based morning logic: 9:00 to 10:00 AM
        const current = new Date(now);
        const hour = current.getHours();
        const isMorning = hour === 9;

        if (isMorning) {
            this.elevators.forEach(elevator => {
                if (
                    elevator.state === 'idle' &&
                    elevator.floor !== 0 &&
                    !elevator.queue.includes(0)
                ) {
                    elevator.addRequest(0);
                    console.log(`🌞 [Morning Rush] Elevator ${elevator.id} returning to Floor 0`);
                }
            });
        }

        const agingThreshold = 30000;

        const aged = this.requests
            .filter(r => !r.assignedAt && now - r.timestamp > agingThreshold)
            .sort((a, b) => a.timestamp - b.timestamp);

        const normal = this.requests
            .filter(r => !r.assignedAt && now - r.timestamp <= agingThreshold)
            .sort((a, b) => a.timestamp - b.timestamp);

        // Assign aged requests to ANY elevator (even inefficiently)
        aged.forEach(req => {
            const best = this.elevators.reduce((best, curr) => {
                const currScore = Math.abs(curr.floor - req.origin) + curr.queue.length * 2;
                const bestScore = Math.abs(best.floor - req.origin) + best.queue.length * 2;
                return currScore < bestScore ? curr : best;
            }, this.elevators[0]);

            if (!best.queue.includes(req.origin)) {
                best.addRequest(req.origin);
                console.warn(`⚠️ [AGING] Request ${req.origin}→${req.destination} assigned to Elevator ${best.id}`);
            }

            req.assignedAt = now;
            req.elevatorId = best.id;
        });

        // Assign normal requests using direction-aware scoring
        normal.forEach(req => {
            const best = this.elevators.reduce((best, curr) => {
                const currScore = this.getDispatchScore(curr, req);
                const bestScore = this.getDispatchScore(best, req);
                return currScore < bestScore ? curr : best;
            }, this.elevators[0]);

            if (!best.queue.includes(req.origin)) {
                best.addRequest(req.origin);
                console.log(`Request ${req.origin}→${req.destination} assigned to Elevator ${best.id}`);
            }

            req.assignedAt = now;
            req.elevatorId = best.id;
        });

        console.log(`== Time: ${this.tick * (this.intervalTime / 1000)}s ==`);
        this.elevators.forEach(elevator => {
            console.log(
                `E${elevator.id}: floor=${elevator.floor}, state=${elevator.state}, queue=[${elevator.queue.join(', ')}]`
            );

            elevator.step();

            this.requests.forEach(req => {
                // Mark as picked up
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

                // Mark as dropped
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

        // Keep only pending requests
        this.requests = this.requests.filter(r => !r.droppedAt);
        this.tick++;
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
        console.log('New request added:', req);
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

        for (const req of this.completed) {
            if (req.pickedUpAt && req.timestamp) {
                const wait = (req.pickedUpAt - req.timestamp) / 1000;
                if (wait >= 0) waitTimes.push(wait);
            }

            if (req.droppedAt && req.pickedUpAt) {
                const travel = (req.droppedAt - req.pickedUpAt) / 1000;
                if (travel >= 0) travelTimes.push(travel);
            }
        }

        const avg = arr => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

        return {
            totalRequests: this.completed.length,
            averageWaitTimeSec: Number(avg(waitTimes).toFixed(2)),
            averageTravelTimeSec: Number(avg(travelTimes).toFixed(2)),
            averageFulfillmentTimeSec: Number(avg(waitTimes.concat(travelTimes)).toFixed(2))
        };
    }
}
