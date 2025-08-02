import React, { useState } from 'react';
import { resetSimulation, handleSpeedChange } from '../api/simulation';
import axios from 'axios';

interface Props {
  onReset: () => void;
  onFloorChange: (floors: number) => void;
  speed: number;
  setSpeed: (s: number) => void;
}


const Controls: React.FC<Props> = ({  onReset, onFloorChange, speed, setSpeed  }) => {
  const [elevators, setElevators] = useState(2);
  const [floors, setFloors] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleReset = async () => {
    await resetSimulation(elevators, floors);
    onReset();
    onFloorChange(floors);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleStart = async () => {
    await resetSimulation(elevators, floors);
    onReset();
    onFloorChange(floors);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = async () => {
    await axios.post('https://elevator-simulation-system-ny44t2jgn-nithinaredlas-projects.vercel.app/api/simulation/pause');
    setIsPaused(true);
  };

  const handleResume = async () => {
    await axios.post('https://elevator-simulation-system-ny44t2jgn-nithinaredlas-projects.vercel.app/api/simulation/resume');
    setIsPaused(false);
  };

  const handleSpeedClick = async (value: number) => {
    await handleSpeedChange(value);
    setSpeed(value);
  };

  return (
    <div className="sticky top-0 h-screen w-64 bg-white shadow-md p-4 flex flex-col gap-4 border-r border-gray-200 z-50">
      <h2 className="text-xl font-semibold text-gray-800">Controls</h2>

      <label className="text-sm text-gray-600">Elevators</label>
      <input
        type="number"
        value={elevators}
        onChange={(e) => setElevators(+e.target.value)}
        className="border px-2 py-1 rounded"
        placeholder="Elevators"
        min={1}
      />

      <label className="text-sm text-gray-600">Floors</label>
      <input
        type="number"
        value={floors}
        onChange={(e) => setFloors(+e.target.value)}
        className="border px-2 py-1 rounded"
        placeholder="Floors"
        min={1}
      />

      {!isRunning ? (
        <button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Start
        </button>
      ) : isPaused ? (
        <button onClick={handleResume} className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Resume
        </button>
      ) : (
        <button onClick={handlePause} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded">
          Stop
        </button>
      )}

      <button onClick={handleReset} className="bg-gray-800 hover:bg-gray-900 text-white py-2 rounded">
        Reset
      </button>

      <div className="mt-4">
        <p className="text-sm text-gray-700 font-semibold mb-1">Speed</p>
        <div className="flex gap-2">
          {[1, 2, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleSpeedClick(value)}
              className={`px-3 py-1 rounded border transition-all duration-200 ${
                speed === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
              }`}
            >
              {value}x
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Selected: {speed}x</p>
      </div>
    </div>
  );
};

export default Controls;
