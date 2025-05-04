import { useState, useCallback, ReactNode } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

export interface ExpandableDisplayProps {
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
  initialExpanded?: boolean;
  title: string;
}

export const ExpandableDisplay = ({
  collapsedContent,
  expandedContent,
  initialExpanded = false,
  title,
}: ExpandableDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>
        <button
          aria-label={isExpanded ? '折りたたむ' : '展開する'}
          className="text-xs text-gray-600"
          onClick={toggleExpand}>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isExpanded ? expandedContent : collapsedContent}
    </div>
  );
};
