
import React from 'react';

const ResponseTimeChart = () => {
  const data = [
    { label: 'HYPERTENSION', time: 12, width: 90 },
    { label: 'DIABETES', time: 10, width: 75 },
    { label: 'OBESITY', time: 8, width: 60 },
    { label: 'ASTHMA', time: 6, width: 45 },
    { label: 'SLEEP DISORDER', time: 4, width: 30 },
    { label: 'ENT', time: 14, width: 100 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-800">AVERAGE RESPONSE TIME BY DIVISION</h3>
        <span className="text-lg font-bold text-gray-800">12</span>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-xs text-gray-600 w-24 uppercase tracking-wide">
              {item.label}
            </span>
            <div className="flex-1 relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-cyan-400 rounded-full"
                  style={{ width: `${item.width}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseTimeChart;
