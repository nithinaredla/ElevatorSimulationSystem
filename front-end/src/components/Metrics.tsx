import React from 'react';
import { FaStopwatch, FaListUl, FaClock, FaRoad } from 'react-icons/fa';

interface Props {
  totalRequests: number;
  averageFulfillmentTimeSec: number;
  averageWaitTimeSec: number;
  averageTravelTimeSec: number;
}

const Metrics: React.FC<Props> = ({
  totalRequests,
  averageFulfillmentTimeSec,
  averageWaitTimeSec,
  averageTravelTimeSec,
}) => (
  <div className="bg-white p-2 rounded shadow border text-sm space-y-2">
    <h2 className="text-base font-semibold text-gray-800 border-b pb-1">📊 Metrics</h2>

    {/* Total requests fulfilled */}
    <div className="flex items-center gap-1 text-gray-700">
      <FaListUl className="text-blue-600 text-xs" />
      <span>Total Completed:</span>
      <strong className="text-gray-900">{totalRequests}</strong>
    </div>

    {/* Average time from request to completion */}
    <div className="flex items-center gap-1 text-gray-700">
      <FaStopwatch className="text-green-600 text-xs" />
      <span>Avg Fulfillment:</span>
      <strong className="text-gray-900">{averageFulfillmentTimeSec}s</strong>
    </div>

    {/* Average wait time */}
    <div className="flex items-center gap-1 text-gray-700">
      <FaClock className="text-yellow-600 text-xs" />
      <span>Avg Wait:</span>
      <strong className="text-gray-900">{averageWaitTimeSec}s</strong>
    </div>

    {/* Average travel time */}
    <div className="flex items-center gap-1 text-gray-700">
      <FaRoad className="text-purple-600 text-xs" />
      <span>Avg Travel:</span>
      <strong className="text-gray-900">{averageTravelTimeSec}s</strong>
    </div>
  </div>
);

export default Metrics;
