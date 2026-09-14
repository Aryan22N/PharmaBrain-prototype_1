import React from 'react';
import { MedicalDocument } from '../../types/health';
import { ProvenanceBlock } from '../common/ProvenanceBlock';
import { X, FileText, Download, Building, Calendar, UserCheck } from 'lucide-react';

interface DocumentPreviewModalProps {
  document: MedicalDocument | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document: doc, onClose }) => {
  if (!doc) return null;

  return (
    <div
      id="doc-preview-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="doc-preview-modal-content"
        className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {doc.type}
                </span>
                <span className="text-xs text-slate-500 font-mono">{doc.fileSize}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{doc.filename}</h3>
            </div>
          </div>
          <button
            id="btn-close-doc-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Metadata Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block">Issuing Facility:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {doc.issuingFacility}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Physician / Author:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                {doc.doctorName || 'Institutional Lab'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Upload / Ingest Date:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {doc.uploadDate}
              </span>
            </div>
          </div>

          {/* Simulated Document Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulated Document Layout Preview
              </h4>
              <span className="text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-medium">
                OCR Extracted & Digitally Verified
              </span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap shadow-inner border border-slate-700 select-text overflow-x-auto max-h-72">
              {doc.simulatedPreviewText}
            </div>
          </div>

          {/* Provenance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Document Provenance</h4>
            <ProvenanceBlock
              source={doc.source}
              reliability={doc.reliability}
              verification={doc.verification}
              originalReference={doc.filename}
              facility={doc.issuingFacility}
              date={doc.uploadDate}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Demonstration document copy preserved in client-side state.</span>
          <button
            id="btn-dismiss-doc-modal"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
