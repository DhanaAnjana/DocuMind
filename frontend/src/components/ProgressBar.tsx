// components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label,
  showPercentage = true 
}) => {
  const getColorClass = (progress: number) => {
    if (progress < 30) return 'bg-warning';
    if (progress < 70) return 'bg-accent';
    return 'bg-success';
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-text-dark">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-text-light">{progress.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-out ${getColorClass(progress)} progress-bar-fill`}
          data-progress={progress}
        />
      </div>
    </div>
  );
};

export default ProgressBar;