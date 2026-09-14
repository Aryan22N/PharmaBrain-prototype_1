import React, { useState, useMemo } from 'react';
import { useHealthStore } from '../../lib/health-store';
import { SourceBadge } from '../../components/common/SourceBadge';
import { ReliabilityBadge } from '../../components/common/ReliabilityBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { RecordDetailModal } from '../../components/modals/RecordDetailModal';
import { MedicalRecord, SourceType, VerificationStatus } from '../../types/health';
import {
  Clock,
  Filter,
  Search,
  AlertTriangle,
  FileText,
  Building,
  Calendar,
  Eye,
  Tag,
  CheckCircle,
} from 'lucide-react';

export const PatientTimelinePage: React.FC = () => {
  const { medicalRecords, totalRecordsCount } = useHealthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalRecord, setActiveModalRecord] = useState<MedicalRecord | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return medicalRecords.filter((rec) => {
      const matchSearch =
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.practitioner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.originalReference.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSource =
        selectedSource === 'ALL' || rec.source === selectedSource;

      const matchCategory =
        selectedCategory === 'ALL' || rec.category === selectedCategory;

      return matchSearch && matchSource && matchCategory;
    });
  }, [medicalRecords, searchQuery, selectedSource, selectedCategory]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Longitudinal Medical Timeline</h1>
            <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-semibold">
              2019 – September 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological audit trail with independent Source, Reliability, and Verification classifications.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          Showing <span className="font-bold text-slate-900">{filteredRecords.length}</span> of{' '}
          <span className="font-bold text-slate-900">{totalRecordsCount}</span> records
        </div>
      </div>

      {/* Prominent Conflict Callout Banner */}
      <div
        id="timeline-conflict-notification-banner"
        className="p-4 bg-amber-50 rounded-xl border border-amber-300 shadow-xs flex items-start gap-3.5"
      >
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-amber-950">Active Clinical Discrepancy Flagged</span>
            <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Safety Priority
            </span>
          </div>
          <p className="leading-relaxed">
            Conflicting information detected — Hospital HMS record is shown as the higher-priority source. The
            patient-entered record has been retained for history.
          </p>
          <p className="text-[11px] text-amber-800 font-mono pt-1">
            HMS Reference: Metformin 500 mg BID (10 Sep 2026) vs Patient Self-Entry: Metformin 1000 mg (11 Sep 2026).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records by title, doctor, facility, or original reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-teal-600 font-medium"
          />
        </div>

        {/* Filter by Source */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-700 w-full md:w-auto"
          >
            <option value="ALL">All Sources</option>
            <option value={SourceType.HOSPITAL_HMS}>Hospital HMS</option>
            <option value={SourceType.PATIENT_DOCUMENT}>Patient Document</option>
            <option value={SourceType.MANUAL_ENTRY}>Manual Entry</option>
          </select>

          {/* Filter by Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-700 w-full md:w-auto"
          >
            <option value="ALL">All Categories</option>
            <option value="Medication">Medications</option>
            <option value="Lab Result">Lab Results</option>
            <option value="Clinical Encounter">Clinical Encounters</option>
            <option value="Vital Measurement">Vitals & Measurements</option>
            <option value="Symptom Report">Symptoms</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Imaging">Imaging</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
        {filteredRecords.map((record) => {
          const isConflictItem = record.isConflict || record.verification === VerificationStatus.CONFLICTING;

          return (
            <div
              key={record.id}
              className="relative group"
            >
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[25px] sm:-left-[33px] top-4 w-4 h-4 rounded-full border-2 bg-white ${
                  isConflictItem
                    ? 'border-amber-600 bg-amber-100 ring-4 ring-amber-50'
                    : record.source === SourceType.HOSPITAL_HMS
                    ? 'border-sky-600 bg-sky-50'
                    : record.source === SourceType.PATIENT_DOCUMENT
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-400 bg-slate-50'
                }`}
              />

              {/* Record Card */}
              <div
                onClick={() => setActiveModalRecord(record)}
                className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                  isConflictItem
                    ? 'bg-amber-50/50 border-amber-300 shadow-xs hover:border-amber-400'
                    : 'bg-white border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-sm'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {record.date}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {record.category}
                    </span>
                    {isConflictItem && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        Conflicting Information
                      </span>
                    )}
                  </div>

                  {/* THREE SEPARATE BADGES REQUIRED BY PROMPT */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <SourceBadge source={record.source} size="sm" />
                    <ReliabilityBadge level={record.reliability} size="sm" />
                    <VerificationBadge status={record.verification} size="sm" />
                  </div>
                </div>

                {/* Body Content */}
                <div className="py-3 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>{record.title}</span>
                    <span className="text-xs text-teal-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Provenance</span>
                    </span>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {record.summary}
                  </p>

                  {/* Discrete values preview if present */}
                  {record.values && Object.keys(record.values).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Object.entries(record.values).map(([k, v]) => (
                        <div key={k} className="text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-200">
                          <span className="text-slate-500 font-medium">{k}: </span>
                          <span className="font-bold text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Conflict explanation snippet if conflicting */}
                  {isConflictItem && (
                    <div className="p-2.5 bg-amber-100/60 rounded border border-amber-200 text-xs text-amber-900">
                      <p className="font-semibold text-amber-950">Provenance Discrepancy Note:</p>
                      <p className="text-[11px] leading-snug">
                        Hospital HMS record is shown as the higher-priority source. The patient-entered record has
                        been retained for history.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer / Provenance info preview */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium">{record.facility}</span>
                    <span>•</span>
                    <span>{record.practitioner}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>Ref:</span>
                    <span className="text-slate-700 font-bold">{record.originalReference}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRecords.length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
            No clinical records matched your filter criteria.
          </div>
        )}
      </div>

      {/* Record Provenance Modal */}
      <RecordDetailModal
        record={activeModalRecord}
        onClose={() => setActiveModalRecord(null)}
      />
    </div>
  );
};
