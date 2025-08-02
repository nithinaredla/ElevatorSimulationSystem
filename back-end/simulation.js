export class Elevator {
    constructor(id, totalFloors) {
        this.id = id;
        this.floor = 0;
        this.direction = 'idle';
        this.doorOpen = false;
        this.queue = [];
        this.totalFloors = totalFloors;
    }

    step() {
        if (this.queue.length === 0) {
            this.direction = 'idle';
            this.doorOpen = false;
            return;
        }

        if (this.doorOpen) {
            this.doorOpen = false;
            return;
        }

        // Serve floor if present
        if (this.queue.includes(this.floor)) {
            this.queue = this.queue.filter(f => f !== this.floor);
            this.doorOpen = true;
            return;
        }

        const up = this.queue.filter(f => f > this.floor).sort((a, b) => a - b);
        const down = this.queue.filter(f => f < this.floor).sort((a, b) => b - a);

        if (this.direction === 'up') {
            if (up.length > 0) {
                this.floor += 1;
            } else if (down.length > 0) {
                this.direction = 'down';
                this.floor -= 1;
            } else {
                this.direction = 'idle';
            }
        } else if (this.direction === 'down') {
            if (down.length > 0) {
                this.floor -= 1;
            } else if (up.length > 0) {
                this.direction = 'up';
                this.floor += 1;
            } else {
                this.direction = 'idle';
            }
        } else {
            // Idle: decide initial direction
            if (up.length > 0) {
                this.direction = 'up';
                this.floor += 1;
            } else if (down.length > 0) {
                this.direction = 'down';
                this.floor -= 1;
            }
        }
    }

    addRequest(floor) {
        if (!this.queue.includes(floor)) {
            this.queue.push(floor);
        }
    }

    getState() {
        return {
            id: this.id,
            floor: this.floor,
            direction: this.direction,
            doorOpen: this.doorOpen,
            queue: [...this.queue]
        };
    }
}


export class Simulation {
    constructor(numElevators, numFloors) {
        this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i, numFloors));
        this.requests = [];
        this.completed = [];
        this.interval = null;
        this.running = false;
    }

    start() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.step(), 1000);
        this.running = true;
    }

    pause() {
        if (this.interval) clearInterval(this.interval);
        this.running = false;
    }

    resume() {
        if (!this.running) this.start();
    }

    reset() {
        this.pause();
        this.elevators.forEach(e => {
            e.queue = [];
            e.floor = 0;
            e.direction = 'idle';
            e.doorOpen = false;
        });
        this.requests = [];
        this.completed = [];
    }

    step() {
        // Assign requests
        const unassigned = this.requests.filter(r => !r.assignedAt);
        unassigned.forEach(req => {
            const bestElevator = this.elevators.reduce((best, curr) => {
                const currScore = Math.abs(curr.floor - req.origin) + curr.queue.length * 2;
                const bestScore = Math.abs(best.floor - req.origin) + best.queue.length * 2;
                return currScore < bestScore ? curr : best;
            }, this.elevators[0]);

            bestElevator.addRequest(req.origin);
            req.assignedAt = Date.now();
            req.elevatorId = bestElevator.id;
        });

        // Move elevators
        this.elevators.forEach(elevator => {
            elevator.step();

            this.requests.forEach(req => {
                if (
                    req.elevatorId === elevator.id &&
                    elevator.floor === req.origin &&
                    elevator.doorOpen &&
                    !req.pickedUp
                ) {
                    req.pickedUp = true;
                    elevator.addRequest(req.destination); // ✅ Now safe to add destination
                }

                if (
                    req.elevatorId === elevator.id &&
                    req.pickedUp &&
                    req.destination === elevator.floor &&
                    elevator.doorOpen &&
                    !req.droppedAt
                ) {
                    req.droppedAt = Date.now();
                    this.completed.push(req);
                }
            });
            ;
        });

        this.requests = this.requests.filter(r => !r.droppedAt);
    }

    addRequest(origin, destination) {
        const req = {
            origin,
            destination,
            timestamp: Date.now(),
            assignedAt: null,
            pickedUp: false,
            droppedAt: null,
            elevatorId: null
        };
        this.requests.push(req);
    }

    getState() {
        return {
            elevators: this.elevators.map(e => e.getState()),
            pendingRequests: [...this.requests]
        };
    }

    getMetrics() {
        const travelTimes = this.completed.map(req => (req.droppedAt - req.timestamp) / 1000);
        const avg = travelTimes.length
            ? travelTimes.reduce((a, b) => a + b, 0) / travelTimes.length
            : 0;

        return {
            totalRequests: this.completed.length,
            averageFulfillmentTimeSec: Number(avg.toFixed(2)),
        };
    }
}
