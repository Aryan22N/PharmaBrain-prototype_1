import React from 'react';
import { VerificationStatus } from '../../types/health';
import { CheckCircle2, FileCheck, Check, HelpCircle, AlertTriangle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus | string;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'sm' }) => {
  const isSm = size === 'sm';
  const baseClasses = isSm
    ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border'
    : 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border';

  switch (status) {
    case VerificationStatus.HOSPITAL_VERIFIED:
      return (
        <span
          id="badge-verif-hosp"
          className={`${baseClasses} bg-emerald-50 text-emerald-900 border-emerald-200`}
          title="Verification: Hospital Verified via institution digital signature"
        >
          <CheckCircle2 className={isSm ? 'w-3 h-3 text-emerald-700' : 'w-3.5 h-3.5 text-emerald-700'} />
          <span>Hospital Verified</span>
        </span>
      );
    case VerificationStatus.DOCUMENT_SUPPORTED:
      return (
        <span
          id="badge-verif-doc"
          className={`${baseClasses} bg-cyan-50 text-cyan-900 border-cyan-200`}
          title="Verification: Document Supported with attached PDF/image artifact"
        >
          <FileCheck className={isSm ? 'w-3 h-3 text-cyan-700' : 'w-3.5 h-3.5 text-cyan-700'} />
          <span>Document Supported</span>
        </span>
      );
    case VerificationStatus.PATIENT_CONFIRMED:
      return (
        <span
          id="badge-verif-patient"
          className={`${baseClasses} bg-blue-50 text-blue-900 border-blue-200`}
          title="Verification: Patient Confirmed after manual check"
        >
          <Check className={isSm ? 'w-3 h-3 text-blue-700' : 'w-3.5 h-3.5 text-blue-700'} />
          <span>Patient Confirmed</span>
        </span>
      );
    case VerificationStatus.CONFLICTING:
      return (
        <span
          id="badge-verif-conflict"
          className={`${baseClasses} bg-amber-50 text-amber-900 border-amber-300 font-semibold`}
          title="Verification: Conflicting with another recorded clinical source"
        >
          <AlertTriangle className={isSm ? 'w-3 h-3 text-amber-700' : 'w-3.5 h-3.5 text-amber-700'} />
          <span>Conflicting Record</span>
        </span>
      );
    case VerificationStatus.UNVERIFIED:
    default:
      return (
        <span
          id="badge-verif-unverif"
          className={`${baseClasses} bg-slate-100 text-slate-700 border-slate-300`}
          title="Verification: Unverified patient self-note"
        >
          <HelpCircle className={isSm ? 'w-3 h-3 text-slate-500' : 'w-3.5 h-3.5 text-slate-500'} />
          <span>Unverified</span>
        </span>
      );
  }
};
