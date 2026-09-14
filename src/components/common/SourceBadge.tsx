import React from 'react';
import { SourceType } from '../../types/health';
import { Building2, FileText, PenLine } from 'lucide-react';

interface SourceBadgeProps {
  source: SourceType | string;
  size?: 'sm' | 'md';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, size = 'sm' }) => {
  const isSm = size === 'sm';
  const baseClasses = isSm
    ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border'
    : 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border';

  switch (source) {
    case SourceType.HOSPITAL_HMS:
      return (
        <span
          id="badge-source-hms"
          className={`${baseClasses} bg-sky-50 text-sky-900 border-sky-200`}
          title="Source: Authenticated Hospital Hospital Management System (HMS)"
        >
          <Building2 className={isSm ? 'w-3 h-3 text-sky-600' : 'w-3.5 h-3.5 text-sky-600'} />
          <span>Hospital HMS</span>
        </span>
      );
    case SourceType.PATIENT_DOCUMENT:
      return (
        <span
          id="badge-source-doc"
          className={`${baseClasses} bg-amber-50 text-amber-900 border-amber-200`}
          title="Source: Scanned document or laboratory PDF uploaded by patient"
        >
          <FileText className={isSm ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
          <span>Patient Document</span>
        </span>
      );
    case SourceType.MANUAL_ENTRY:
    default:
      return (
        <span
          id="badge-source-manual"
          className={`${baseClasses} bg-slate-100 text-slate-800 border-slate-300`}
          title="Source: Direct self-reported manual entry by patient"
        >
          <PenLine className={isSm ? 'w-3 h-3 text-slate-600' : 'w-3.5 h-3.5 text-slate-600'} />
          <span>Manual Entry</span>
        </span>
      );
  }
};
