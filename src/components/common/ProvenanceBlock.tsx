import React from 'react';
import { SourceType, ReliabilityLevel, VerificationStatus } from '../../types/health';
import { SourceBadge } from './SourceBadge';
import { ReliabilityBadge } from './ReliabilityBadge';
import { VerificationBadge } from './VerificationBadge';
import { Fingerprint, Building, Calendar, Hash, FileText } from 'lucide-react';

interface ProvenanceBlockProps {
  source: SourceType | string;
  reliability: ReliabilityLevel | string;
  verification: VerificationStatus | string;
  originalReference: string;
  facility?: string;
  practitioner?: string;
  date?: string;
  documentFilename?: string;
}

export const ProvenanceBlock: React.FC<ProvenanceBlockProps> = ({
  source,
  reliability,
  verification,
  originalReference,
  facility,
  practitioner,
  date,
  documentFilename,
}) => {
  return (
    <div
      id="provenance-block-container"
      className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2.5"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
          <Fingerprint className="w-3.5 h-3.5 text-teal-700" />
          Record Provenance & Chain of Custody
        </span>
        <span className="text-[11px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
          FHIR Provenance Spec
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <div className="text-[11px] text-slate-500 mb-1 font-medium">Record Source</div>
          <SourceBadge source={source} />
        </div>
        <div>
          <div className="text-[11px] text-slate-500 mb-1 font-medium">Source Reliability</div>
          <ReliabilityBadge level={reliability} />
        </div>
        <div>
          <div className="text-[11px] text-slate-500 mb-1 font-medium">Verification Status</div>
          <VerificationBadge status={verification} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/80 text-slate-600">
        <div className="flex items-center gap-1.5 truncate">
          <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500">Original Ref:</span>
          <span className="font-mono text-slate-800 font-medium truncate">{originalReference}</span>
        </div>

        {documentFilename && (
          <div className="flex items-center gap-1.5 truncate">
            <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-slate-500">Document:</span>
            <span className="text-teal-800 font-medium truncate">{documentFilename}</span>
          </div>
        )}

        {facility && (
          <div className="flex items-center gap-1.5 truncate">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">Origin Facility:</span>
            <span className="text-slate-700 font-medium truncate">{facility}</span>
          </div>
        )}

        {date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">Logged Date:</span>
            <span className="text-slate-700 font-medium">{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};
