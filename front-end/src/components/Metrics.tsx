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
  <div className="bg-white p-4 rounded shadow border text-sm space-y-3">
    <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">📊 Metrics</h2>

    {/* Total requests fulfilled */}
    <div className="flex items-center gap-2 text-gray-700">
      <FaListUl className="text-blue-600" />
      <span>Total Completed:</span>
      <strong className="text-gray-900">{totalRequests}</strong>
    </div>

    {/* Average time from request to completion */}
    <div className="flex items-center gap-2 text-gray-700">
      <FaStopwatch className="text-green-600" />
      <span>Avg Fulfillment Time:</span>
      <strong className="text-gray-900">{averageFulfillmentTimeSec}s</strong>
    </div>

    {/* Average time waiting before boarding */}
    <div className="flex items-center gap-2 text-gray-700">
      <FaClock className="text-yellow-600" />
      <span>Avg Wait Time:</span>
      <strong className="text-gray-900">{averageWaitTimeSec}s</strong>
    </div>

    {/* Average duration spent inside elevator */}
    <div className="flex items-center gap-2 text-gray-700">
      <FaRoad className="text-purple-600" />
      <span>Avg Travel Time:</span>
      <strong className="text-gray-900">{averageTravelTimeSec}s</strong>
    </div>
  </div>
);

export default Metrics;
