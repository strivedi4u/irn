
import React from 'react';

interface DonutChartProps {
  title: string;
  percentage: number;
  compliantPercentage: number;
  nonCompliantPercentage: number;
  notUpdatedPercentage: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  percentage,
  compliantPercentage,
  nonCompliantPercentage,
  notUpdatedPercentage
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  const compliantStroke = (compliantPercentage / 100) * circumference;
  const nonCompliantStroke = (nonCompliantPercentage / 100) * circumference;
  const notUpdatedStroke = (notUpdatedPercentage / 100) * circumference;

  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="relative flex justify-center mb-4">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />
          
          {/* Compliant segment */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#3B82F6"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${compliantStroke} ${circumference}`}
            strokeLinecap="round"
          />
          
          {/* Non-compliant segment */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#06B6D4"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${nonCompliantStroke} ${circumference}`}
            strokeDashoffset={-compliantStroke}
            strokeLinecap="round"
          />
          
          {/* Not updated segment */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#10B981"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${notUpdatedStroke} ${circumference}`}
            strokeDashoffset={-(compliantStroke + nonCompliantStroke)}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600 uppercase tracking-wide">COMPLIANCE</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-gray-600 uppercase tracking-wide">NON-COMPLIANCE</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600 uppercase tracking-wide">NOT UPDATED</span>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
