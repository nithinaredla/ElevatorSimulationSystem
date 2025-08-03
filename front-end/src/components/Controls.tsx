import React, { useState } from 'react';
import {
  resetSimulation,
  handleSpeedChange,
  pauseSimulation,
  resumeSimulation,
  addRequest,
  addBulkRequests
} from '../api/simulation';
import { AxiosError } from 'axios';

interface Props {
  onReset: () => void;
  onFloorChange: (floors: number) => void;
  speed: number;
  setSpeed: (s: number) => void;
}

const Controls: React.FC<Props> = ({ onReset, onFloorChange, speed, setSpeed }) => {
  const [elevators, setElevators] = useState(2);
  const [floors, setFloors] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [origin, setOrigin] = useState<number>(0);
  const [destination, setDestination] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    await pauseSimulation();
    setIsPaused(true);
  };

  const handleResume = async () => {
    await resumeSimulation();
    setIsPaused(false);
  };

  const handleSpeedClick = async (value: number) => {
    await handleSpeedChange(value);
    setSpeed(value);
  };

  const handleAddRequest = async () => {
    setError(null);
    setSuccess(null);

    if (origin < 0 || destination < 0 || origin >= floors || destination >= floors) {
      setError(`Origin and Destination must be between 0 and ${floors - 1}`);
      return;
    }

    if (origin === destination) {
      setError("Origin and Destination cannot be the same");
      return;
    }

    try {
      await addRequest(origin, destination);
      setSuccess("Request added successfully");
      setOrigin(0);
      setDestination(0);
    } catch (err) {
      const error = err as AxiosError;
      const message =
        error.response && error.response.data
          ? (error.response.data as { message?: string }).message || "Failed to add request"
          : "Failed to add request";
      setError(message);
      console.error("Error adding request:", error);
    }
  };
  const handleStressTest = async () => {
    const generatedRequests = [];

    for (let i = 0; i < 100; i++) {
      const origin = Math.floor(Math.random() * floors);
      let destination;
      do {
        destination = Math.floor(Math.random() * floors);
      } while (destination === origin);

      generatedRequests.push({ origin, destination });
    }

    try {
      await addBulkRequests(generatedRequests);
      setSuccess("Stress test: 100 requests added.");
    } catch (err) {
      setError("Failed to run stress test.");
      console.error(err);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md p-2 border-r flex flex-col gap-3 z-50 text-sm">
      <h2 className="text-base font-semibold text-gray-800">Controls</h2>

      {/* Elevator/Floor Horizontal Inputs */}
      <div className="flex gap-2">
        <div className="flex flex-col flex-1">
          <label className="text-xs text-gray-600">Elevators</label>
          <input
            type="number"
            value={elevators}
            onChange={(e) => setElevators(+e.target.value)}
            className="w-full border px-1 py-1 rounded text-xs"
            min={1}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xs text-gray-600">Floors</label>
          <input
            type="number"
            value={floors}
            onChange={(e) => setFloors(+e.target.value)}
            className="w-full border px-1 py-1 rounded text-xs"
            min={1}
          />
        </div>
      </div>

      {/* Start/Reset buttons side by side */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded"
          >
            Start
          </button>
        ) : isPaused ? (
          <button
            onClick={handleResume}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
          >
            Resume
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-1 rounded"
        >
          Reset
        </button>
      </div>

      {/* ➕ Message below Start */}
      {!isRunning && (
        <p className="text-xs text-gray-600 text-center italic">
          Click start to add requests, set speed, or run tests.
        </p>
      )}


      {/* Hide this entire section unless simulation is running */}
      {isRunning && (
        <>
          {/* Manual Request Inputs */}
          <hr className="my-1" />
          <h3 className="text-sm font-semibold text-gray-700">Manual Request</h3>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <label className="text-xs text-gray-600">Origin</label>
              <input
                type="number"
                value={origin}
                onChange={(e) => setOrigin(Number(e.target.value))}
                className="border px-2 py-1 rounded text-sm"
                min={0}
                max={floors - 1}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-xs text-gray-600">Destination</label>
              <input
                type="number"
                value={destination}
                onChange={(e) => setDestination(Number(e.target.value))}
                className="border px-2 py-1 rounded text-sm"
                min={0}
                max={floors - 1}
              />
            </div>
          </div>

          <button
            onClick={handleAddRequest}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded mt-1 text-sm"
          >
            Add Request
          </button>

          {error && <p className="text-red-600 text-xs">{error}</p>}
          {success && <p className="text-green-600 text-xs">{success}</p>}

          {/* Speed Controls */}
          <hr className="my-1" />
          <p className="text-xs text-gray-700 font-semibold mb-1">Speed</p>
          <div className="flex gap-1">
            {[1, 2, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleSpeedClick(value)}
                className={`px-2 py-1 rounded border transition-all duration-200 text-xs ${speed === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                  }`}
              >
                {value}x
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Selected: {speed}x</p>

          {/* Stress Test */}
          <hr className="my-1" />
          <h3 className="text-sm font-semibold text-gray-700">Testing</h3>
          <button
            onClick={handleStressTest}
            className="bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm"
          >
            Run Stress Test (100)
          </button>
        </>
      )}
    </div>
  );


};

export default Controls;
