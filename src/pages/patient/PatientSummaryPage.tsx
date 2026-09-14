import React from 'react';
import { useHealthStore } from '../../lib/health-store';
import {
  Printer,
  FileText,
  AlertCircle,
  Building,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export const PatientSummaryPage: React.FC = () => {
  const {
    patientProfile,
    medications,
    medicalRecords,
    symptoms,
    trends,
    totalRecordsCount,
    hospitalVerifiedCount,
  } = useHealthStore();

  const handlePrint = () => {
    window.print();
  };

  const activeMeds = medications.filter((m) => m.isActive);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900">Consolidated Clinical Summary</h1>
          <p className="text-xs text-slate-500">
            Print-friendly narrative export designed for doctor handover and clinical consultation.
          </p>
        </div>

        <button
          id="btn-print-summary"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Summary / PDF</span>
        </button>
      </div>

      {/* Printable Clinical Document */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-300 shadow-sm print:border-none print:shadow-none space-y-8 text-slate-800">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-teal-800">
              National Digital Health Mission • ABDM Compliant Summary
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              PATIENT HEALTH CONTEXT & CLINICAL BRIEF
            </h2>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Document Ref: PHR-SUM-2026-0913 • Generated on 13 September 2026
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-900">Demo General Hospital & Affiliates</div>
            <div className="text-slate-500">Longitudinal Care Record (2019–2026)</div>
          </div>
        </div>

        {/* Section 1: Demographics */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            1. Patient Demographics & Identification
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div>
              <span className="text-slate-500 block text-[11px]">Full Name</span>
              <span className="font-bold text-slate-900">{patientProfile.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Age / Sex / Blood Group</span>
              <span className="font-bold text-slate-900">
                {patientProfile.age} Yrs / {patientProfile.gender} / {patientProfile.bloodGroup}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">ABHA Address</span>
              <span className="font-mono text-slate-900">{patientProfile.abhaAddress}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Emergency Contact</span>
              <span className="font-bold text-slate-900">
                {patientProfile.emergencyContact.name} ({patientProfile.emergencyContact.phone})
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Known Chronic Conditions */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            2. Active Diagnoses & Chronic Health Conditions
          </h3>
          <div className="overflow-hidden border border-slate-200 rounded-lg text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Condition</th>
                  <th className="py-2 px-3">ICD-10</th>
                  <th className="py-2 px-3">Onset</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Verified By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {patientProfile.conditions.map((cond) => (
                  <tr key={cond.id}>
                    <td className="py-2 px-3 font-semibold text-slate-900">{cond.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{cond.icdCode}</td>
                    <td className="py-2 px-3 text-slate-600">{cond.diagnosedDate}</td>
                    <td className="py-2 px-3 text-slate-800">{cond.status}</td>
                    <td className="py-2 px-3 text-slate-600">{cond.diagnosedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Medication History */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            3. Active Pharmacotherapy & Dosage Schedule
          </h3>
          <div className="overflow-hidden border border-slate-200 rounded-lg text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Medication</th>
                  <th className="py-2 px-3">Dosage & Frequency</th>
                  <th className="py-2 px-3">Indication</th>
                  <th className="py-2 px-3">Prescriber</th>
                  <th className="py-2 px-3">Source & Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeMeds.map((med) => (
                  <tr key={med.id}>
                    <td className="py-2 px-3 font-bold text-slate-900">{med.name}</td>
                    <td className="py-2 px-3 text-slate-800">
                      {med.dosage} — {med.frequency}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{med.indication}</td>
                    <td className="py-2 px-3 text-slate-600">{med.prescribedBy}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                      {med.source} • {med.verification}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic pt-1">
            *Note: A conflicting patient-entered dose of Metformin 1000 mg is preserved in the audit trail but hospital
            HMS prescription (500 mg BID) remains active standard.
          </p>
        </div>

        {/* Section 4: Longitudinal Timeline Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            4. Longitudinal Timeline Highlights (2019–2026)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 py-1.5 border-b border-slate-100">
              <span className="font-mono text-slate-500">10 Sep 2026</span>
              <span className="font-bold text-slate-900 sm:col-span-2">
                Outpatient Consultation & Metformin Initiation (500mg BID)
              </span>
              <span className="text-slate-600 sm:text-right">Dr. Priya Deshmukh (DGH)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 py-1.5 border-b border-slate-100">
              <span className="font-mono text-slate-500">22 Aug 2026</span>
              <span className="font-bold text-slate-900 sm:col-span-2">
                Glycated Hemoglobin (HbA1c) Lab Panel: 8.1%
              </span>
              <span className="text-slate-600 sm:text-right">Apex Diagnostic Centre</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 py-1.5 border-b border-slate-100">
              <span className="font-mono text-slate-500">18 Apr 2026</span>
              <span className="font-bold text-slate-900 sm:col-span-2">
                Routine Blood Pressure Evaluation (144/92 mmHg)
              </span>
              <span className="text-slate-600 sm:text-right">Demo General Hospital</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 py-1.5 border-b border-slate-100">
              <span className="font-mono text-slate-500">14 Nov 2024</span>
              <span className="font-bold text-slate-900 sm:col-span-2">
                Essential Hypertension Diagnosis; Telmisartan 40mg Initiated
              </span>
              <span className="text-slate-600 sm:text-right">Dr. Rajesh Iyer</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 py-1.5 border-b border-slate-100">
              <span className="font-mono text-slate-500">12 Jun 2021</span>
              <span className="font-bold text-slate-900 sm:col-span-2">
                Type 2 Diabetes Mellitus Primary Diagnosis (Fasting 182 mg/dL)
              </span>
              <span className="text-slate-600 sm:text-right">City Healthcare Clinic</span>
            </div>
          </div>
        </div>

        {/* Section 5: Trend Interpretation */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            5. Clinical Trend Interpretation & Trajectories
          </h3>
          <div className="space-y-2 text-xs leading-relaxed text-slate-700">
            {trends.map((t) => (
              <div key={t.id} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-slate-900">{t.title}: </span>
                {t.interpretation}
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Reported Symptoms & Temporal Association */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            6. Patient-Reported Symptoms & Adverse Reactions
          </h3>
          {symptoms.map((s) => (
            <div key={s.id} className="p-3 bg-amber-50/70 rounded border border-amber-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span>{s.symptom} (Onset: {s.onsetDate})</span>
                <span>Severity: {s.severity}</span>
              </div>
              <p className="text-amber-900">{s.patientNotes}</p>
              {s.temporalCorrelationText && (
                <p className="text-[11px] text-amber-950 font-semibold pt-1 border-t border-amber-200">
                  Clinical correlation: {s.temporalCorrelationText}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Section 7: Provenance & Missing Information Audit */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            7. Source Reliability & Missing Information Audit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Record Provenance Reliability</span>
              <p className="text-slate-600">
                Total Records: {totalRecordsCount} | Hospital Verified: {hospitalVerifiedCount} (50%) | Document
                Supported: 4 (29%) | Patient Confirmed: 2 (14%) | Unverified / Conflicting: 1 (7%).
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Identified Information Gaps</span>
              <p className="text-slate-600">
                Missing 2022–2023 longitudinal lab panels; no documented ophthalmology fundus exam; renal microalbuminuria
                panel recommended for comprehensive diabetes staging.
              </p>
            </div>
          </div>
        </div>

        {/* Signature & Disclaimer Footer */}
        <div className="pt-6 border-t border-slate-300 text-[11px] text-slate-500 space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <p>Generated by Patient-Centric Digital Medical Record Demo Platform</p>
              <p>Certified for clinical consultation demonstration purposes only.</p>
            </div>
            <div className="text-right">
              <div className="w-48 border-b border-slate-400 pb-1 mb-1 font-mono text-[10px] text-slate-400">
                PHYSICIAN SIGNATURE
              </div>
              <p className="font-semibold text-slate-800">Dr. Priya Deshmukh, MD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
