import React, { useEffect, useState } from 'react';
import type { Elevator } from '../types';

interface Props {
  elevator: Elevator;
  numFloors: number;
  speed?: number; // Optional: to dynamically adjust animation timing
}

const ElevatorComponent: React.FC<Props> = ({ elevator, numFloors, speed = 1 }) => {
  const [animatedFloor, setAnimatedFloor] = useState(elevator.floor);
  const floorHeight = 40;

  const directionIcon =
    elevator.direction === 'up' ? '↑' :
    elevator.direction === 'down' ? '↓' : '⏹️';

  useEffect(() => {
    if (!elevator.doorOpen && elevator.floor !== animatedFloor) {
      // Delay updating animatedFloor to sync with backend movement
      const timeout = setTimeout(() => {
        setAnimatedFloor(elevator.floor);
      }, 2000 / speed); // Match backend timing adjusted by speed
      return () => clearTimeout(timeout);
    }

    if (elevator.doorOpen && elevator.floor !== animatedFloor) {
      setAnimatedFloor(elevator.floor); // Snap if open
    }
  }, [elevator.floor, elevator.doorOpen, animatedFloor, speed]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2 text-sm font-semibold text-gray-700">
        Elevator {elevator.id}
      </div>

      <div
        className="relative w-20 border border-gray-300 bg-white rounded shadow overflow-hidden"
        style={{ height: numFloors * floorHeight }}
      >
        {/* Animated elevator box */}
        <div
          className="absolute left-0 w-full"
          style={{
            transform: `translateY(${(numFloors - 1 - animatedFloor) * floorHeight}px)`,
            transition: `transform ${2000 / speed}ms ease-in-out`
          }}
        >
          <div className="relative h-10 bg-gray-800 text-white font-semibold flex items-center justify-center">
            {/* Doors */}
            <div
              className={`absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ${elevator.doorOpen ? 'w-0' : 'w-1/2'}`}
            />
            <div
              className={`absolute right-0 top-0 h-full bg-blue-500 transition-all duration-500 ${elevator.doorOpen ? 'w-0' : 'w-1/2'}`}
            />

            {/* State/Direction */}
            <div className="z-10 text-center leading-tight text-xs">
              <div>{directionIcon}</div>
              <div className="text-yellow-300 text-[10px]">
                {animatedFloor === elevator.floor && (
                  <>
                    {elevator.state === 'boarding' && '⏳ Boarding'}
                    {elevator.state === 'opening' && '🚪 Opening'}
                    {elevator.state === 'closing' && '🚪 Closing'}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Static floor labels */}
        {Array.from({ length: numFloors }, (_, i) => (
          <div
            key={i}
            className={`absolute left-0 w-full h-10 border-t text-center text-sm flex items-center justify-center ${
              i === animatedFloor ? 'text-transparent' : 'text-gray-600'
            }`}
            style={{ bottom: i * floorHeight }}
          >
            Floor {i}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElevatorComponent;
