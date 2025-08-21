import React from 'react';

const DetailedMetricCard = ({
  title,
  previousValue,
  recentValue,
  percentage,
  previousLabel = "PREVIOUS",
  recentLabel = "RECENT"
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-4">
        {title}
      </h3>
      
      <div className="space-y-4">
        {/* Previous */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
              {previousLabel}
            </span>
          </div>
          <span className="text-xl font-bold text-gray-700">{previousValue}</span>
        </div>
        
        {/* Recent */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
              {recentLabel}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-700">{recentValue}</span>
            {percentage && (
              <span className="text-sm font-medium text-cyan-500">▲ {percentage}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedMetricCard;