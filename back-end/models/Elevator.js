export class Elevator {
  constructor(id, numFloors) {
    this.id = id;
    this.floor = 0;
    this.numFloors = numFloors;
    this.state = 'idle'; // idle, moving, opening, boarding, closing
    this.queue = [];
    this.direction = 'idle'; // up, down, idle
    this.doorOpen = false;
    this.stepTimer = 0;
  }

  addRequest(floor) {
    if (!this.queue.includes(floor)) {
      this.queue.push(floor);
      this.sortQueue(); // sort intelligently
    }
  }

  sortQueue() {
    const above = this.queue.filter(f => f > this.floor).sort((a, b) => a - b);
    const below = this.queue.filter(f => f < this.floor).sort((a, b) => b - a);

    if (this.direction === 'up') {
      this.queue = [...above, ...below];
    } else if (this.direction === 'down') {
      this.queue = [...below, ...above];
    } else {
      // Idle: pick closest and decide direction
      const closest = this.queue
        .slice()
        .sort((a, b) => Math.abs(a - this.floor) - Math.abs(b - this.floor));
      this.queue = closest;
    }
  }

  updateDirection() {
    if (this.queue.length === 0) {
      this.direction = 'idle';
      return;
    }

    const nextFloor = this.queue[0];
    if (nextFloor > this.floor) this.direction = 'up';
    else if (nextFloor < this.floor) this.direction = 'down';
    else this.direction = 'idle';
  }

  step() {
    switch (this.state) {
      case 'idle':
        if (this.queue.length > 0) {
          const next = this.queue[0];
          if (next === this.floor) {
            this.state = 'opening';
            this.stepTimer = 1;
            this.doorOpen = false;
          } else {
            this.updateDirection();
            this.sortQueue(); // sort on direction change
            this.state = 'moving';
            this.stepTimer = 1;
          }
        }
        break;

      case 'moving':
        if (this.stepTimer > 0) {
          this.stepTimer--;
        } else {
          this.floor += this.direction === 'up' ? 1 : -1;

          if (this.queue.includes(this.floor)) {
            this.state = 'opening';
            this.stepTimer = 1;
            this.doorOpen = false;
          } else {
            this.stepTimer = 1; // continue moving
          }
        }
        break;

      case 'opening':
        if (this.stepTimer > 0) {
          this.stepTimer--;
        } else {
          this.state = 'boarding';
          this.doorOpen = true;
          this.stepTimer = 2;
        }
        break;

      case 'boarding':
        if (this.stepTimer > 0) {
          this.stepTimer--;
        } else {
          this.state = 'closing';
          this.stepTimer = 1;
        }
        break;

      case 'closing':
        if (this.stepTimer > 0) {
          this.stepTimer--;
        } else {
          this.doorOpen = false;
          this.queue = this.queue.filter(f => f !== this.floor);

          if (this.queue.length > 0) {
            this.updateDirection();
            this.sortQueue(); // re-sort after removing current
            this.state = 'moving';
            this.stepTimer = 1;
          } else {
            this.state = 'idle';
            this.direction = 'idle';
          }
        }
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
