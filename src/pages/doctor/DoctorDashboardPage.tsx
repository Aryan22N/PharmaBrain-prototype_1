import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useHealthStore } from '../../lib/health-store';
import { SourceBadge } from '../../components/common/SourceBadge';
import { ReliabilityBadge } from '../../components/common/ReliabilityBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { TrendChart } from '../../components/charts/TrendChart';
import { RecordDetailModal } from '../../components/modals/RecordDetailModal';
import { MedicalRecord, SourceType, VerificationStatus } from '../../types/health';
import {
  Stethoscope,
  AlertTriangle,
  FileText,
  Pill,
  Activity,
  HeartPulse,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  User,
  ShieldCheck,
  Check,
  MessageSquarePlus,
  ArrowRight,
  Info,
} from 'lucide-react';

export const DoctorDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    patientProfile,
    medications,
    medicalRecords,
    symptoms,
    trends,
    showToast,
    conflictRecordsCount,
  } = useHealthStore();

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [discrepancyAcknowledged, setDiscrepancyAcknowledged] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [clinicalNoteText, setClinicalNoteText] = useState('');

  const activeMeds = medications.filter((m) => m.isActive);

  const handleAcknowledgeDiscrepancy = () => {
    setDiscrepancyAcknowledged(true);
    showToast('Discrepancy acknowledged: Hospital prescription of Metformin 500mg confirmed as authoritative.');
  };

  const handleReconcileMeds = () => {
    showToast('Medication list reconciled. Patient informed of 500mg BID regimen with meals.');
  };

  const handleSaveNote = () => {
    if (!clinicalNoteText.trim()) return;
    showToast('Clinical encounter note added to patient record.');
    setShowNoteModal(false);
    setClinicalNoteText('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Patient Clinical Summary Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900">{patientProfile.name}</h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
              MRN: {patientProfile.mrn}
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Patient Session
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
            <span>
              Demographics: <strong>{patientProfile.age} Yrs</strong> / <strong>{patientProfile.gender}</strong>
            </span>
            <span>•</span>
            <span>
              Blood Group: <strong>{patientProfile.bloodGroup}</strong>
            </span>
            <span>•</span>
            <span>
              Conditions: <strong className="text-teal-900">Type 2 DM (2021)</strong>,{' '}
              <strong className="text-indigo-900">HTN (2023)</strong>
            </span>
          </div>
        </div>

        {/* Top Assistant Link */}
        <button
          id="btn-goto-query-assistant"
          onClick={() => navigate('/doctor/dashboard/query')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Launch Clinical Query Assistant</span>
        </button>
      </div>

      {/* DISCREPANCY ALERT BANNER explicitly required by prompt */}
      <div
        id="doctor-discrepancy-banner"
        className={`p-5 rounded-xl border shadow-xs transition-all ${
          discrepancyAcknowledged
            ? 'bg-emerald-50/70 border-emerald-300'
            : 'bg-amber-50 border-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {discrepancyAcknowledged ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {discrepancyAcknowledged
                    ? 'Clinical Discrepancy Reconciled & Acknowledged'
                    : 'Active Medication Dosage Discrepancy Detected'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    discrepancyAcknowledged
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {discrepancyAcknowledged ? 'Reconciled' : 'Action Required'}
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Hospital HMS prescription order indicates <strong>Metformin 500 mg BID</strong> (prescribed by Dr. Priya
                Deshmukh on 10 Sep 2026), whereas patient manual log specifies <strong>1000 mg</strong> (entered 11 Sep
                2026). The Hospital HMS entry is prioritized for clinical safety, while the patient note has been
                retained for audit history.
              </p>

              <div className="pt-1 text-[11px] text-slate-500 font-mono">
                Authoritative Source: Demo General Hospital FHIR Gateway (PKI Signature Verified)
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            {!discrepancyAcknowledged ? (
              <button
                id="btn-acknowledge-discrepancy"
                onClick={handleAcknowledgeDiscrepancy}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Acknowledge Discrepancy</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Confirmed Authoritative
              </span>
            )}

            <button
              onClick={handleReconcileMeds}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Reconcile Patient Record
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-teal-700" />
          <span className="font-bold text-slate-800">Physician Action Controls:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNoteModal(true)}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Add Clinical Note</span>
          </button>

          <button
            onClick={handleReconcileMeds}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Reconcile Medications
          </button>
        </div>
      </div>

      {/* Two-Column Clinical Core: Active Regimen + Patient Symptoms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Regimen Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-700" />
              Active Medication Regimen
            </h2>
            <span className="text-xs text-slate-500">{activeMeds.length} Active Prescriptions</span>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-lg text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Medication</th>
                  <th className="py-2.5 px-3">Dosage / Frequency</th>
                  <th className="py-2.5 px-3">Source & Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeMeds.map((m) => (
                  <tr key={m.id} className={m.isConflict ? 'bg-amber-50/50' : 'bg-white'}>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">{m.indication}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{m.dosage}</div>
                      <div className="text-[11px] text-slate-500">{m.frequency}</div>
                    </td>
                    <td className="py-2.5 px-3 space-y-1">
                      <SourceBadge source={m.source} size="sm" />
                      <div>
                        <VerificationBadge status={m.verification} size="sm" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Physician Note: </span>
            Metformin titrated to 500mg BID on 10 Sep 2026 to improve glycemic control (HbA1c 8.1%). Telmisartan 40mg
            maintained for essential hypertension.
          </div>
        </div>

        {/* Patient Symptoms & Temporal Association */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-700" />
              Patient-Reported Symptoms & Adverse Events
            </h2>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
              PRO Stream
            </span>
          </div>

          {symptoms.map((s) => (
            <div key={s.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{s.symptom}</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                  {s.severity} Severity
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Reported: {s.reportedDate} (Onset: {s.onsetDate})
              </div>

              <p className="text-slate-700 leading-relaxed">{s.patientNotes}</p>

              {/* Temporal Association Callout */}
              {s.temporalCorrelationText && (
                <div className="p-2.5 bg-teal-50 rounded border border-teal-200 text-teal-950 space-y-1 mt-2">
                  <span className="font-bold text-[11px] text-teal-900 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-teal-700" />
                    Temporal Association Identified:
                  </span>
                  <p className="text-[11px] leading-snug">{s.temporalCorrelationText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Biomarker Trends Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-700" />
            Biomarker & Vital Trajectories (Clinical Review)
          </h2>
          <span className="text-xs text-slate-500">Longitudinal Trend Analysis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trends.map((t) => (
            <div key={t.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{t.title}</span>
                <span className="font-bold text-teal-900">
                  {t.data[t.data.length - 1].value} {t.unit}
                </span>
              </div>
              <TrendChart trend={t} isMini={true} />
              <p className="text-[11px] text-slate-600 line-clamp-2 pt-1">{t.interpretation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Longitudinal Timeline Preview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" />
            Synchronized Patient Timeline ({medicalRecords.length} Entries)
          </h2>
          <button
            onClick={() => navigate('/patient/timeline')}
            className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
          >
            <span>Inspect All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {medicalRecords.slice(0, 5).map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{rec.title}</span>
                  <span className="text-[11px] font-mono text-slate-400">{rec.date}</span>
                </div>
                <p className="text-slate-600 line-clamp-1">{rec.summary}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <SourceBadge source={rec.source} size="sm" />
                <VerificationBadge status={rec.verification} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Add Clinical Encounter Note</h3>
            <p className="text-xs text-slate-500">
              Note will be recorded into Rahul Sharma's longitudinal audit stream signed by Dr. Priya Deshmukh.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Advised patient that mild epigastric discomfort is common with Metformin initiation. Instructed to take dose strictly with dinner."
              value={clinicalNoteText}
              onChange={(e) => setClinicalNoteText(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-teal-600 text-slate-800"
            />

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs"
              >
                Save Clinical Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Modal */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
