export class Elevator {
  constructor(id, numFloors) {
    this.id = id;
    this.numFloors = numFloors;
    this.floor = 0;
    this.state = 'idle'; // idle, moving, opening, boarding, closing
    this.queue = [];
    this.direction = 'idle'; // up, down, idle
    this.doorOpen = false;
    this.stepTimer = 0;
  }

  addRequest(floor) {
    if (!this.queue.includes(floor)) {
      this.queue.push(floor);
      this.sortQueue();
    }
  }

  sortQueue() {
    const above = this.queue.filter(f => f > this.floor).sort((a, b) => a - b);
    const below = this.queue.filter(f => f < this.floor).sort((a, b) => b - a);

    switch (this.direction) {
      case 'up':
        this.queue = [...above, ...below];
        break;
      case 'down':
        this.queue = [...below, ...above];
        break;
      default:
        // Idle — prioritize closest request
        this.queue.sort((a, b) => Math.abs(a - this.floor) - Math.abs(b - this.floor));
    }
  }

  updateDirection() {
    if (this.queue.length === 0) {
      this.direction = 'idle';
      return;
    }
    const next = this.queue[0];
    this.direction = next > this.floor ? 'up' : next < this.floor ? 'down' : 'idle';
  }

  step() {
    if (this.stepTimer > 0) {
      this.stepTimer--;
      return;
    }

    switch (this.state) {
      case 'idle':
        if (this.queue.length > 0) {
          const next = this.queue[0];
          if (next === this.floor) {
            this.state = 'opening';
          } else {
            this.updateDirection();
            this.sortQueue();
            this.state = 'moving';
          }
          this.stepTimer = 1;
        }
        break;

      case 'moving':
        this.floor += this.direction === 'up' ? 1 : -1;
        if (this.queue.includes(this.floor)) {
          this.state = 'opening';
        }
        this.stepTimer = 1;
        break;

      case 'opening':
        this.doorOpen = true;
        this.state = 'boarding';
        this.stepTimer = 2;
        break;

      case 'boarding':
        this.state = 'closing';
        this.stepTimer = 1;
        break;

      case 'closing':
        this.doorOpen = false;
        this.queue = this.queue.filter(f => f !== this.floor);
        if (this.queue.length) {
          this.updateDirection();
          this.sortQueue();
          this.state = 'moving';
        } else {
          this.state = 'idle';
          this.direction = 'idle';
        }
        this.stepTimer = 1;
        break;
    }
  }

  getState() {
    return {
      id: this.id,
      floor: this.floor,
      queue: [...this.queue],
      state: this.state,
      direction: this.direction,
      doorOpen: this.doorOpen
    };
  }
}
