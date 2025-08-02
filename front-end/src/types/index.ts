export interface Elevator {
  id: number;
  floor: number;
  direction: 'up' | 'down' | 'idle';
  doorOpen: boolean;
  queue: number[];
  state: 'idle' | 'moving' | 'opening' | 'boarding' | 'closing'; // ✅ for animation
}


export interface Metrics {
  totalRequests: number;
  averageWaitTimeSec: number;
  averageTravelTimeSec: number;
}

