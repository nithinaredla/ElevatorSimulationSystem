import React, { useEffect, useState } from 'react';
import type { Elevator } from './types';
import { getSimulationState, getMetrics } from './api/simulation';
import ElevatorComponent from './components/Elevator';
import Controls from './components/Controls';
import Metrics from './components/Metrics';

const App: React.FC = () => {
    const [elevators, setElevators] = useState<Elevator[]>([]);
    const [metrics, setMetrics] = useState({ totalRequests: 0, averageFulfillmentTimeSec: 0, averageWaitTimeSec: 0, averageTravelTimeSec: 0});
    const [numFloors, setNumFloors] = useState(0);
    const [speed, setSpeed] = useState(1);

    const fetchState = async () => {
        try {
            const { data } = await getSimulationState();
            setElevators(data.elevators);
        } catch (err) {
            console.error('Backend not responding', err);
        }
    };

    const fetchMetrics = async () => {
        try {
            const { data } = await getMetrics();
            setMetrics(data);
        } catch (err) {
            console.error('Metrics fetch failed', err);
        }
    };

    useEffect(() => {
        fetchState();
        fetchMetrics();
        const interval = setInterval(() => {
            fetchState();
            fetchMetrics();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sticky Sidebar for Controls + Metrics */}
            <div className="sticky top-0 h-screen w-64 bg-white shadow-md p-4 border-r flex flex-col gap-6 z-50">
                <Controls onReset={fetchState} onFloorChange={setNumFloors} speed={speed} setSpeed={setSpeed} />
                <Metrics {...metrics} />
            </div>

            {/* Main Elevator Display Area */}
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Elevator Simulation</h1>

                <div className="flex gap-6 items-end overflow-x-auto">

                    {/* Elevator Components */}
                    {elevators.map(elevator => (
                        <ElevatorComponent
                            key={elevator.id}
                            elevator={elevator}
                            numFloors={numFloors}
                            speed={speed} // NEW PROP
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
