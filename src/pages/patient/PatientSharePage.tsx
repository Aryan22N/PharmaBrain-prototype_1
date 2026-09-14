import React, { useState } from 'react';
import { useHealthStore } from '../../lib/health-store';
import {
  Share2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Key,
  QrCode,
  Copy,
  Trash2,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react';

export const PatientSharePage: React.FC = () => {
  const { showToast, patientProfile } = useHealthStore();

  const [recipient, setRecipient] = useState('Dr. Priya Deshmukh (Demo General Hospital)');
  const [duration, setDuration] = useState('24 hours');
  const [sections, setSections] = useState({
    demographics: true,
    medications: true,
    vitals: true,
    labs: true,
    documents: false,
    symptoms: true,
  });

  const [activeGrant, setActiveGrant] = useState<{
    token: string;
    pin: string;
    expiresAt: string;
    recipient: string;
    sections: string[];
  } | null>({
    token: 'ABDM-CONSENT-9942-PRV',
    pin: '7482',
    expiresAt: 'Tomorrow at 11:30 AM',
    recipient: 'Dr. Priya Deshmukh (Demo General Hospital)',
    sections: ['Demographics', 'Active Medications', 'Vitals Trends', 'Lab Results', 'Symptom Log'],
  });

  const handleGenerateShare = () => {
    const activeSectionList = Object.entries(sections)
      .filter(([_, v]) => v)
      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newToken = `ABDM-CONSENT-${Math.floor(1000 + Math.random() * 9000)}-PRV`;

    setActiveGrant({
      token: newToken,
      pin: newPin,
      expiresAt: duration === '1 hour' ? 'In 1 hour' : duration === '24 hours' ? 'Tomorrow at this time' : 'In 7 days',
      recipient,
      sections: activeSectionList,
    });

    showToast('Secure time-bound clinical consent link generated successfully.');
  };

  const handleRevoke = () => {
    setActiveGrant(null);
    showToast('Consent grant has been immediately revoked. Access terminated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">Patient Consent & Data Sharing Manager</h1>
          <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
            ABDM Consent Framework
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Grant granular, time-limited, and revocable read access to authorized healthcare providers and specialists.
        </p>
      </div>

      {/* Active Access Grant Card if present */}
      {activeGrant && (
        <div
          id="active-consent-grant-card"
          className="p-5 bg-teal-50/70 rounded-xl border border-teal-300 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-teal-950">Active Digital Consent Token</div>
                <div className="text-[11px] font-mono text-teal-800">Token ID: {activeGrant.token}</div>
              </div>
            </div>

            <button
              onClick={handleRevoke}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Revoke Consent Immediately</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white rounded-lg border border-teal-200">
              <span className="text-slate-500 block text-[11px]">Authorized Recipient</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{activeGrant.recipient}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-teal-200">
              <span className="text-slate-500 block text-[11px]">Access Verification PIN</span>
              <span className="font-mono text-base font-bold text-teal-900 mt-0.5 block tracking-wider">
                {activeGrant.pin}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-teal-200">
              <span className="text-slate-500 block text-[11px]">Validity Window</span>
              <span className="font-semibold text-emerald-800 mt-0.5 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Expires {activeGrant.expiresAt}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-teal-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              Shared Domains: <strong className="font-semibold">{activeGrant.sections.join(', ')}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Sharing Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Configure New Clinical Share Consent
          </h2>

          {/* Recipient Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Authorised Clinician / Facility</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800"
            >
              <option value="Dr. Priya Deshmukh (Demo General Hospital)">
                Dr. Priya Deshmukh, MD (Endocrinology — Demo General Hospital)
              </option>
              <option value="Dr. Rajesh Iyer (Apollo Heart Centre)">
                Dr. Rajesh Iyer, MD (Cardiology — Apollo Clinic)
              </option>
              <option value="General OPD Physician (Ad-Hoc Consultation)">
                General Outpatient Emergency / Urgent Care Center
              </option>
            </select>
          </div>

          {/* Granular Section Checkboxes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Granular Clinical Sections to Share
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { key: 'demographics', label: 'Basic Demographics & Blood Group', default: true },
                { key: 'medications', label: 'Active & Historical Medications', default: true },
                { key: 'vitals', label: 'Blood Pressure & Weight Trends', default: true },
                { key: 'labs', label: 'HbA1c & Fasting Glucose Labs', default: true },
                { key: 'documents', label: 'Raw Scanned PDF Artifacts', default: false },
                { key: 'symptoms', label: 'Patient Symptom Logs & Side Effects', default: true },
              ].map((sec) => (
                <label
                  key={sec.key}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={sections[sec.key as keyof typeof sections]}
                    onChange={(e) =>
                      setSections({ ...sections, [sec.key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-medium text-slate-800">{sec.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Access Duration */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Consent Validity Period</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {['1 hour', '24 hours', '7 days', '30 days'].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`py-2 rounded-lg border font-medium text-center transition-colors cursor-pointer ${
                    duration === dur
                      ? 'bg-teal-700 border-teal-700 text-white font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Access keys auto-expire and are logged in the audit journal.
            </span>

            <button
              id="btn-generate-secure-access"
              type="button"
              onClick={handleGenerateShare}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Generate Secure Demo Access</span>
            </button>
          </div>
        </div>

        {/* Right: Live Share Scope Preview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-700" />
                Live Scope Preview
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                {duration}
              </span>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <p className="font-bold text-slate-900">{patientProfile.name} (MRN: {patientProfile.mrn})</p>
              <p className="text-[11px] text-slate-500">Recipient will view:</p>

              <ul className="space-y-1.5 pl-1">
                {sections.demographics && (
                  <li className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Demographic verification profile</span>
                  </li>
                )}
                {sections.medications && (
                  <li className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active medicines (Telmisartan, Metformin)</span>
                  </li>
                )}
                {sections.vitals && (
                  <li className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Blood Pressure trajectory (146/92 mmHg)</span>
                  </li>
                )}
                {sections.labs && (
                  <li className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>HbA1c trend chart (7.2% → 8.1%)</span>
                  </li>
                )}
                {sections.symptoms && (
                  <li className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>GI symptom report post-Metformin</span>
                  </li>
                )}
                {sections.documents && (
                  <li className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4 original clinical PDF artifacts</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2">
            <div className="w-16 h-16 bg-white border border-slate-300 rounded mx-auto flex items-center justify-center shadow-xs">
              <QrCode className="w-10 h-10 text-slate-700" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Scan QR code in ABDM Doctor App
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
