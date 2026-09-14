import React from 'react';
import { MedicalRecord, VerificationStatus } from '../../types/health';
import { ProvenanceBlock } from '../common/ProvenanceBlock';
import { X, AlertTriangle, FileText, Calendar, Building, User, Tag } from 'lucide-react';

interface RecordDetailModalProps {
  record: MedicalRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div
      id="record-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="record-detail-modal-content"
        className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                {record.category}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {record.date}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{record.title}</h3>
          </div>
          <button
            id="btn-close-record-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Conflict Banner if applicable */}
          {(record.isConflict || record.verification === VerificationStatus.CONFLICTING) && (
            <div
              id="record-conflict-callout"
              className="p-4 bg-amber-50 rounded-lg border border-amber-300 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-900">
                <p className="font-bold text-amber-950">Discrepancy / Conflict Notice</p>
                <p className="leading-relaxed">
                  Conflicting information detected — Hospital HMS record is shown as the higher-priority source. The
                  patient-entered record has been retained for complete chronological history and clinical transparency.
                </p>
                {record.conflictNotes && (
                  <p className="mt-1 italic text-amber-800 font-medium">Note: {record.conflictNotes}</p>
                )}
              </div>
            </div>
          )}

          {/* Practitioner & Facility Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Provider:</span>
              <span className="font-semibold text-slate-800">{record.practitioner}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Facility:</span>
              <span className="font-semibold text-slate-800">{record.facility}</span>
            </div>
          </div>

          {/* Clinical Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Clinical Summary</h4>
            <p className="text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              {record.summary}
            </p>
          </div>

          {/* Detailed Findings */}
          {record.detailedFindings && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Detailed Findings & Observations</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200 whitespace-pre-line">
                {record.detailedFindings}
              </p>
            </div>
          )}

          {/* Extracted / Discrete Values */}
          {record.values && Object.keys(record.values).length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Discrete Parameter Values</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(record.values).map(([key, val]) => (
                  <div key={key} className="bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
                    <div className="text-[11px] text-teal-800 font-medium truncate">{key}</div>
                    <div className="text-sm font-bold text-teal-950 mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {record.tags && record.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {record.tags.map((t) => (
                <span key={t} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Record Provenance block */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Verification & Provenance</h4>
            <ProvenanceBlock
              source={record.source}
              reliability={record.reliability}
              verification={record.verification}
              originalReference={record.originalReference}
              facility={record.facility}
              date={record.date}
              documentFilename={record.documentFilename}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="btn-dismiss-record-modal"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
