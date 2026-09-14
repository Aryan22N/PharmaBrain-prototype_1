import React from 'react';
import { useRouter } from '../../lib/router';
import { useHealthStore } from '../../lib/health-store';
import { SourceBadge } from '../../components/common/SourceBadge';
import { ReliabilityBadge } from '../../components/common/ReliabilityBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import {
  AlertCircle,
  PlusCircle,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Pill,
  HeartPulse,
  CheckCircle2,
} from 'lucide-react';

export const PatientSymptomsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { symptoms } = useHealthStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Symptoms & Side Effects Tracker</h1>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
              {symptoms.length} Logged Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Patient-reported observations cross-referenced with recent medication initiation dates to detect potential adverse drug reactions.
          </p>
        </div>

        <button
          id="btn-report-new-symptom"
          onClick={() => navigate('/patient/add/manual')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report New Symptom</span>
        </button>
      </div>

      {/* Explanation Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3.5 text-xs text-slate-600">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900">Clinical Purpose of Symptom Tracking</span>
          <p className="leading-relaxed">
            Patient-reported outcomes (PROs) capture subtle physical reactions between clinical outpatient visits.
            When a patient logs a symptom, the system correlates its onset date against new prescription orders
            (such as Metformin titration) to highlight possible temporal associations for physician review.
          </p>
        </div>
      </div>

      {/* Symptoms List & Temporal Insight */}
      <div className="space-y-4">
        {symptoms.map((symp) => (
          <div
            key={symp.id}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{symp.symptom}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      symp.severity === 'Mild'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {symp.severity} Severity
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Reported: {symp.reportedDate}
                  </span>
                  <span>•</span>
                  <span>Onset: {symp.onsetDate}</span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 w-fit">
                Status: {symp.status}
              </span>
            </div>

            {/* Patient notes */}
            <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-0.5">Patient Observation:</span>
              <p className="leading-relaxed">{symp.patientNotes}</p>
            </div>

            {/* TEMPORAL ASSOCIATION INSIGHT CARD explicitly required by prompt */}
            {symp.temporalCorrelationText && (
              <div
                id="temporal-association-card"
                className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 flex items-start gap-3.5"
              >
                <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-teal-950">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wide text-teal-900">
                      Possible Temporal Association Detected
                    </span>
                    <span className="bg-teal-200 text-teal-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Clinical Pattern
                    </span>
                  </div>
                  <p className="leading-relaxed">{symp.temporalCorrelationText}</p>
                  <p className="text-[11px] text-teal-800 italic pt-0.5">
                    Action: Flagged on doctor dashboard for Dr. Priya Deshmukh's routine follow-up consultation.
                  </p>
                </div>
              </div>
            )}

            {/* Badges footer */}
            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              <SourceBadge source={symp.source} size="sm" />
              <ReliabilityBadge level={symp.reliability} size="sm" />
              <VerificationBadge status={symp.verification} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
