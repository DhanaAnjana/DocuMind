// components/MetricCard.tsx
import React from 'react';

interface Metric {
  title: string;
  value: number;
  trend: number;
  icon?: string;
}

interface MetricCardProps {
  metric: Metric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const isPositive = metric.trend >= 0;
  const trendColor = isPositive ? 'text-success' : 'text-error';
  const trendIcon = isPositive ? '↗' : '↘';
  
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-light text-sm font-medium uppercase tracking-wide">
          {metric.title}
        </h3>
        {metric.icon && (
          <span className="text-2xl">{metric.icon}</span>
        )}
      </div>
      
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold text-text-dark">{metric.value.toLocaleString()}</span>
        <span className={`text-sm font-semibold ${trendColor} flex items-center space-x-1`}>
          <span>{trendIcon}</span>
          <span>{Math.abs(metric.trend)}%</span>
        </span>
      </div>
    </div>
  );
};

export default MetricCard;