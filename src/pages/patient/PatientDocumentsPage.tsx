import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useHealthStore } from '../../lib/health-store';
import { SourceBadge } from '../../components/common/SourceBadge';
import { ReliabilityBadge } from '../../components/common/ReliabilityBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { DocumentPreviewModal } from '../../components/modals/DocumentPreviewModal';
import { MedicalDocument } from '../../types/health';
import {
  FileText,
  Upload,
  Eye,
  Building,
  Calendar,
  ShieldCheck,
  Download,
  Filter,
} from 'lucide-react';

export const PatientDocumentsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { documents } = useHealthStore();

  const [activePreviewDoc, setActivePreviewDoc] = useState<MedicalDocument | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredDocs = documents.filter((d) =>
    filterType === 'ALL' ? true : d.type === filterType
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Document Locker & Audit Artifacts</h1>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
              {documents.length} Artifacts Preserved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Original hospital FHIR discharge notes, clinical laboratory prints, and scanned prescriptions with OCR extraction status.
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/add/upload')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New Document</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'Prescription', 'Lab Report', 'Diagnostic Imaging', 'Discharge Summary'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer shrink-0 ${
              filterType === cat
                ? 'bg-teal-800 text-white border-teal-900 font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Document Types' : cat}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setActivePreviewDoc(doc)}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer space-y-3.5 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {doc.title}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{doc.filename}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {doc.type}
                </span>
              </div>

              {/* Facility and date */}
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 truncate font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.issuingFacility}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Ingested: {doc.uploadDate}
                  </span>
                  <span className="text-teal-800 font-semibold">{doc.extractionStatus}</span>
                </div>
              </div>
            </div>

            {/* Badges and action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <SourceBadge source={doc.source} size="sm" />
                <VerificationBadge status={doc.verification} size="sm" />
              </div>

              <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={activePreviewDoc}
        onClose={() => setActivePreviewDoc(null)}
      />
    </div>
  );
};
