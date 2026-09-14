import React, { useState } from 'react';
import { useRouter } from '../../../lib/router';
import { useHealthStore } from '../../../lib/health-store';
import { availableHmsImportRecords } from '../../../data/initialData';
import {
  Server,
  Building,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Check,
} from 'lucide-react';

export const HmsImportPage: React.FC = () => {
  const { navigate } = useRouter();
  const { importHmsRecord } = useHealthStore();

  const [selectedRecordId, setSelectedRecordId] = useState<string>('hms-import-10sep');
  const [isImporting, setIsImporting] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);

  const handleStartImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      importHmsRecord(selectedRecordId);
      setIsImporting(false);
      setImportCompleted(true);
    }, 1400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('/patient/add')}
        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Channels</span>
      </button>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200">
              Hospital FHIR Gateway (ABDM)
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Direct PKI Verification
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Import Records from Demo General Hospital
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authenticated connection to hospital clinical data repository. Select one or more available FHIR clinical
            bundles to ingest into your timeline.
          </p>
        </div>

        {/* Facility Info Card */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-sky-700" />
            <div>
              <div className="font-bold text-slate-900">Demo General Hospital (Central Campus)</div>
              <div className="text-[11px] text-slate-500 font-mono">Gateway Node: DGH-FHIR-MUM-01 • Status: Online</div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
            Connected
          </span>
        </div>

        {/* Selectable Records List */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Available Authenticated Records (Select to Ingest)
          </label>

          <div className="space-y-2.5">
            {availableHmsImportRecords.map((rec) => {
              const isSelected = selectedRecordId === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => !isImporting && setSelectedRecordId(rec.id)}
                  className={`p-3.5 rounded-lg border text-xs transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-50/70 border-sky-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rec.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{rec.date}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{rec.details}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                      <span>Doctor: {rec.doctor}</span>
                      <span>•</span>
                      <span>Ref: {rec.reference}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'bg-sky-700 border-sky-700 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button & Status Feedback */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Ingested records are stamped with <strong className="text-slate-800">Reliability: High</strong> and{' '}
            <strong className="text-slate-800">Hospital Verified</strong>.
          </span>

          {!importCompleted ? (
            <button
              id="btn-run-hms-import"
              disabled={isImporting}
              onClick={handleStartImport}
              className="w-full sm:w-auto px-6 py-2.5 bg-sky-700 hover:bg-sky-800 disabled:bg-sky-400 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing from Hospital HMS...</span>
                </>
              ) : (
                <>
                  <Server className="w-4 h-4" />
                  <span>Import Selected Record</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Import Complete
              </span>
              <button
                onClick={() => navigate('/patient/timeline')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                View in Timeline →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
