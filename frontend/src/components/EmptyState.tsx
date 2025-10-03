// components/EmptyState.tsx
import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = '📄', 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-text-dark mb-2">{title}</h3>
      <p className="text-text-light mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;