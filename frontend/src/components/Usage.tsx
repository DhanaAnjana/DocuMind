// components/Usage.tsx
import React from 'react';

interface UsageProps {
  used: number;
  total: number;
  label: string;
}

const Usage: React.FC<UsageProps> = ({ used, total, label }) => {
  const percentage = (used / total) * 100;
  
  return (
    <div className="bg-surface rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-textDark">{label}</span>
        <span className="text-sm text-textDark/70">
          {used} of {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-textDark/50 mt-1">
        {percentage.toFixed(0)}% used
      </div>
    </div>
  );
};

export default Usage;