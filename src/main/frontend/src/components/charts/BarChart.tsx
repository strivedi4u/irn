
import React from 'react';

const BarChart = () => {
  const data = [
    { label: 'HYPERTENSION', value: 85, color: '#3B82F6' },
    { label: 'DIABETES', value: 75, color: '#06B6D4' },
    { label: 'OBESITY', value: 65, color: '#10B981' },
    { label: 'ASTHMA', value: 55, color: '#3B82F6' },
    { label: 'SLEEP DISORDER', value: 45, color: '#06B6D4' },
    { label: 'ENT', value: 90, color: '#10B981' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">USER BY DISORDER</h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-xs text-gray-600 w-24 uppercase tracking-wide">
              {item.label}
            </span>
            <div className="flex-1 relative">
              <div className="h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
            </div>
            <span className="text-xs text-gray-600 w-8">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
