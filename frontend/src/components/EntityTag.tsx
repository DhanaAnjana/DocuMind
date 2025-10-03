// components/EntityTag.tsx
import React from 'react';

export interface Entity {
  id: string;
  text: string;
  type: 'person' | 'organization' | 'date' | 'amount' | 'location' | 'misc';
  confidence: number;
}

interface EntityTagProps {
  entity: Entity;
  size?: 'sm' | 'md';
}

const EntityTag: React.FC<EntityTagProps> = ({ entity, size = 'md' }) => {
  const typeConfig = {
    person: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    organization: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    date: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    amount: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    location: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    misc: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const { bg, text, border } = typeConfig[entity.type];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${bg} ${text} ${border} ${sizeClasses[size]}`}
      title={`${entity.type} • Confidence: ${(entity.confidence * 100).toFixed(1)}%`}
    >
      {entity.text}
    </span>
  );
};

export default EntityTag;