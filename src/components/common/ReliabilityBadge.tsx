import React from 'react';
import { ReliabilityLevel } from '../../types/health';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface ReliabilityBadgeProps {
  level: ReliabilityLevel | string;
  size?: 'sm' | 'md';
}

export const ReliabilityBadge: React.FC<ReliabilityBadgeProps> = ({ level, size = 'sm' }) => {
  const isSm = size === 'sm';
  const baseClasses = isSm
    ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border'
    : 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border';

  switch (level) {
    case ReliabilityLevel.HIGH:
      return (
        <span
          id="badge-rel-high"
          className={`${baseClasses} bg-teal-50 text-teal-900 border-teal-200`}
          title="Reliability: High (Cryptographically signed hospital EHR / direct FHIR ingest)"
        >
          <ShieldCheck className={isSm ? 'w-3 h-3 text-teal-700' : 'w-3.5 h-3.5 text-teal-700'} />
          <span>Reliability: High</span>
        </span>
      );
    case ReliabilityLevel.MEDIUM:
      return (
        <span
          id="badge-rel-medium"
          className={`${baseClasses} bg-indigo-50 text-indigo-900 border-indigo-200`}
          title="Reliability: Medium (External clinic paper/PDF record uploaded with verifiable letterhead)"
        >
          <Shield className={isSm ? 'w-3 h-3 text-indigo-600' : 'w-3.5 h-3.5 text-indigo-600'} />
          <span>Reliability: Med</span>
        </span>
      );
    case ReliabilityLevel.LOW:
    default:
      return (
        <span
          id="badge-rel-low"
          className={`${baseClasses} bg-stone-100 text-stone-800 border-stone-300`}
          title="Reliability: Low (Self-reported patient observation without institutional verification)"
        >
          <ShieldAlert className={isSm ? 'w-3 h-3 text-stone-600' : 'w-3.5 h-3.5 text-stone-600'} />
          <span>Reliability: Low</span>
        </span>
      );
  }
};
