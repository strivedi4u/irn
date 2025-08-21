import React from 'react';

const MetricCard = ({
  title,
  previousValue,
  recentValue,
  percentage,
  showChart = false,
  previousLabel = "PREVIOUS",
  recentLabel = "RECENT"
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-4">
        {title}
      </h3>
      
      {showChart ? (
        <div className="space-y-4">
          {/* Semi-circular chart placeholder */}
          <div className="flex justify-center">
            <div className="relative w-32 h-16">
              <svg viewBox="0 0 128 64" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 16 48 A 32 32 0 0 1 112 48"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress arc - Hypertension */}
                <path
                  d="M 16 48 A 32 32 0 0 1 80 20"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress arc - Diabetes */}
                <path
                  d="M 80 20 A 32 32 0 0 1 112 48"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-lg font-semibold text-gray-700">Total</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600 uppercase tracking-wide">{previousLabel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-gray-600 uppercase tracking-wide">{recentLabel}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">{previousLabel}</span>
            <span className="text-2xl font-bold text-gray-700">{previousValue}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">{recentLabel}</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-700">{recentValue}</span>
              {percentage && (
                <span className="text-sm font-medium text-cyan-500">▲ {percentage}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;