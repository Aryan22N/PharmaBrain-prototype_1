import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useHealthStore } from '../../lib/health-store';
import { TrendChart } from '../../components/charts/TrendChart';
import { SourceBadge } from '../../components/common/SourceBadge';
import { ReliabilityBadge } from '../../components/common/ReliabilityBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { RecordDetailModal } from '../../components/modals/RecordDetailModal';
import { MedicalRecord, SourceType } from '../../types/health';
import {
  FileText,
  ShieldCheck,
  Pill,
  HeartPulse,
  Activity,
  ArrowRight,
  Upload,
  Server,
  PenLine,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const PatientOverviewPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    patientProfile,
    totalRecordsCount,
    hospitalVerifiedCount,
    activeMedicationsCount,
    latestHba1c,
    latestBp,
    latestFastingGlucose,
    medicalRecords,
    trends,
    sourceBreakdown,
    coverageBreakdown,
    conflictRecordsCount,
  } = useHealthStore();

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const recentRecords = medicalRecords.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome, {patientProfile.name}
            </h1>
            <span className="text-[11px] font-mono bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200 font-medium">
              {patientProfile.mrn}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personal Medical Record • Longitudinal Care Summary as of September 2026
          </p>
        </div>

        {/* 3 Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-import-hms"
            onClick={() => navigate('/patient/add/hms')}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Import from HMS</span>
          </button>

          <button
            id="btn-upload-doc"
            onClick={() => navigate('/patient/add/upload')}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>

          <button
            id="btn-add-manual"
            onClick={() => navigate('/patient/add/manual')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PenLine className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Discrepancy / Conflict Alert if active */}
      {conflictRecordsCount > 0 && (
        <div
          id="overview-conflict-banner"
          className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex items-start justify-between gap-3 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-1">
              <p className="font-bold">Conflicting Clinical Information Detected (1 Item)</p>
              <p className="leading-relaxed">
                A patient manual entry for Metformin (1000 mg) conflicts with the hospital prescription order (500 mg).
                Hospital HMS is prioritized for clinical continuity. Both records are preserved in the timeline.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/patient/timeline')}
            className="shrink-0 text-xs font-bold text-amber-900 underline hover:text-amber-950 self-center"
          >
            Review Discrepancy →
          </button>
        </div>
      )}

      {/* Six Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Total Records</span>
            <FileText className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{totalRecordsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across 7 years</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Hospital Verified</span>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-teal-800 mt-1">{hospitalVerifiedCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {Math.round((hospitalVerifiedCount / (totalRecordsCount || 1)) * 100)}% of total
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Active Meds</span>
            <Pill className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{activeMedicationsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Oral therapies</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Last HbA1c</span>
            <Activity className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 mt-1">{latestHba1c}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Aug 2026 (Elevated)</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Latest Blood Pressure</span>
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{latestBp}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">10 Sep 2026 (Stage 1)</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>History Coverage</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-teal-800 mt-1">70%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Good baseline</div>
        </div>
      </div>

      {/* Health Overview & Priority Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Health Overview + Latest Measurements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Overview Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                Longitudinal Health Status Summary
              </h2>
              <span className="text-[11px] text-slate-500">Updated 13 Sep 2026</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Rahul Sharma is a 42-year-old male with active Type 2 Diabetes Mellitus (diagnosed June 2021) and
              Essential Hypertension (diagnosed March 2023). Current glycemic indices demonstrate sub-optimal control
              with an HbA1c of 8.1% (August 2026) and fasting glucose of 168 mg/dL. On 10 September 2026, Dr. Priya
              Deshmukh initiated Metformin 500 mg BID alongside ongoing Telmisartan 40 mg OD. Mild transient epigastric
              discomfort was subsequently logged by the patient.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Primary Diagnosis</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">Type 2 Diabetes Mellitus</span>
                <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 inline-block mt-1 font-medium">
                  ICD E11.9
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Secondary Diagnosis</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">Essential Hypertension</span>
                <span className="text-[10px] text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 inline-block mt-1 font-medium">
                  ICD I10
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Primary Facility</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">Demo General Hospital</span>
                <span className="text-[10px] text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 inline-block mt-1 font-medium">
                  ABDM Connected
                </span>
              </div>
            </div>
          </div>

          {/* Four Mini Trend Charts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-700" />
                Vitals & Biomarker Trajectories (Mini Trends)
              </h2>
              <button
                onClick={() => navigate('/patient/trends')}
                className="text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1"
              >
                <span>Full Trends & Insights</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trends.map((trend) => (
                <div key={trend.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{trend.title}</div>
                      <div className="text-[10px] text-slate-500">Target: {trend.targetRange}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-teal-900">
                        {trend.data[trend.data.length - 1].value} {trend.unit}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trend.data[trend.data.length - 1].date}
                      </div>
                    </div>
                  </div>
                  <TrendChart trend={trend} isMini={true} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Priority Info Card, Source Breakdown, Coverage */}
        <div className="space-y-6">
          {/* Priority Card explicitly required by prompt */}
          <div
            id="how-records-are-prioritized-card"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">
              <Info className="w-4 h-4 text-teal-700" />
              <span>How Records Are Prioritized</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              To guarantee clinical safety, this system applies deterministic provenance hierarchy when displaying data:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-sky-50/80 border border-sky-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-sky-950">
                  <span>1. Hospital HMS</span>
                  <span className="text-[10px] bg-sky-200 text-sky-900 px-1.5 py-0.2 rounded">Highest</span>
                </div>
                <p className="text-[11px] text-sky-800">
                  Direct EHR/FHIR telemetry with cryptographic certificates. Takes priority in dose or medication conflicts.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span>2. Patient-Uploaded Documents</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">Medium</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  External clinic records, scanned prescriptions, and lab printouts verified via document OCR.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>3. Patient Manual Entries</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">Patient-Reported</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Home symptom logs and notes. Unverified unless supported by clinical documentation.
                </p>
              </div>
            </div>
          </div>

          {/* Source Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Source Breakdown ({totalRecordsCount} Records)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  Hospital HMS
                </span>
                <span className="font-bold text-slate-900">{sourceBreakdown.hospitalHms} records</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${(sourceBreakdown.hospitalHms / (totalRecordsCount || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Patient Documents
                </span>
                <span className="font-bold text-slate-900">{sourceBreakdown.patientDocument} records</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(sourceBreakdown.patientDocument / (totalRecordsCount || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  Manual Entries
                </span>
                <span className="font-bold text-slate-900">{sourceBreakdown.manualEntry} records</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-500 h-full rounded-full"
                  style={{ width: `${(sourceBreakdown.manualEntry / (totalRecordsCount || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Medical History Coverage Progress List */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Medical History Coverage
            </h3>
            <div className="space-y-3 text-xs">
              {Object.values(coverageBreakdown).map((cov: { label: string; status: string; pct: number }) => (
                <div key={cov.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{cov.label}</span>
                    <span className="text-[11px] font-bold text-slate-600">{cov.status}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-700 h-full rounded-full"
                      style={{ width: `${cov.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Timeline Activity Feed */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-700" />
              Recent Clinical Timeline Activity
            </h3>
            <p className="text-xs text-slate-500">Latest entries synchronized to Rahul's longitudinal record</p>
          </div>
          <button
            onClick={() => navigate('/patient/timeline')}
            className="text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All {totalRecordsCount} Entries</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentRecords.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">{rec.title}</span>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">{rec.date}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">{rec.summary}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <SourceBadge source={rec.source} />
                <VerificationBadge status={rec.verification} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Details Modal */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
