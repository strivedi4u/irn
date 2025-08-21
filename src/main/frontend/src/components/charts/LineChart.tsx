
import React from 'react';

const LineChart = () => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const hypertensionData = [20, 25, 30, 28, 35, 32, 38, 42, 40, 45, 48, 50];
  const diabetesData = [15, 18, 22, 20, 25, 28, 30, 32, 35, 38, 40, 42];
  const obesityData = [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38];

  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">CHANGE IN COMPLIANCE</h3>
      
      <div className="relative h-48">
        <svg width="100%" height="100%" viewBox="0 0 400 180">
          {/* Grid lines */}
          {[0, 20, 40, 60, 80, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={180 - (y * 1.8)}
              x2="400"
              y2={180 - (y * 1.8)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Hypertension line */}
          <polyline
            points={hypertensionData.map((value, index) => 
              `${(index * 33.33)},${180 - (value * 3.6)}`
            ).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          
          {/* Diabetes line */}
          <polyline
            points={diabetesData.map((value, index) => 
              `${(index * 33.33)},${180 - (value * 3.6)}`
            ).join(' ')}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
          />
          
          {/* Obesity line */}
          <polyline
            points={obesityData.map((value, index) => 
              `${(index * 33.33)},${180 - (value * 3.6)}`
            ).join(' ')}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
          />
        </svg>
        
        {/* Month labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {months.slice(0, 12).map((month, index) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600 uppercase tracking-wide">HYPERTENSION</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-gray-600 uppercase tracking-wide">DIABETES</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600 uppercase tracking-wide">OBESITY</span>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
