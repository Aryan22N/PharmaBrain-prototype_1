import React from 'react';
import { useRouter } from '../../lib/router';
import {
  Server,
  Building,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  ArrowDown,
  Info,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const PatientHmsPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Hospital Management System (HMS) Integration</h1>
            <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online & Synchronized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Direct bi-directional gateway integration with Demo General Hospital via Ayushman Bharat Digital Mission (ABDM) standards.
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/add/hms')}
          className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Hospital Records</span>
        </button>
      </div>

      {/* Connection Specs & Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Primary Integrated Facility</div>
          <div className="text-sm font-bold text-slate-900">Demo General Hospital</div>
          <div className="text-[11px] text-slate-500 font-mono">Registry ID: IN-MH-DGH-4412</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Interoperability Protocol</div>
          <div className="text-sm font-bold text-teal-800">HL7® FHIR® R4 Bundle</div>
          <div className="text-[11px] text-slate-500">Profiles: Observation, MedicationRequest</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Cryptographic Trust</div>
          <div className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PKI Direct Signed</span>
          </div>
          <div className="text-[11px] text-slate-500">ABDM Gateway Root Certificate</div>
        </div>
      </div>

      {/* Vertical Data Flow Diagram explicitly required by prompt */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-700" />
            Architectural Data Flow Pipeline
          </h2>
          <p className="text-xs text-slate-500">
            How clinical data traverses from the hospital electronic medical record into the patient's longitudinal repository.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-2 py-2">
          {/* Step 1 */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Hospital EHR Event Generation</div>
              <div className="text-[11px] text-slate-600">
                Clinician finalizes OPD consultation or discharges patient at Demo General Hospital.
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 py-0.5">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-sky-50 rounded-lg border border-sky-200 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-sky-950">ABDM Consent & Gateway Authentication</div>
              <div className="text-[11px] text-sky-800">
                Patient ABHA token verified with mutual TLS handshake against national gateway.
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 py-0.5">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-teal-50 rounded-lg border border-teal-200 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-teal-950">FHIR R4 Ingestion & Semantic Normalization</div>
              <div className="text-[11px] text-teal-800">
                Bundle parsed into discrete observation models (HbA1c, BP) and active medication requests.
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 py-0.5">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 4 */}
          <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">Provenance & Priority Stamping</div>
              <div className="text-[11px] text-emerald-800">
                Stamped with "Source: Hospital HMS", "Reliability: High", and "Hospital Verified". Assigned priority in conflict resolution.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Records Ingested via HMS */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Sample Synchronized Hospital Clinical Bundles
        </h3>

        <div className="overflow-hidden border border-slate-200 rounded-lg text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Encounter / Order</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">FHIR Resource</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  Metformin 500 mg BID Order (Dr. Priya Deshmukh)
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-mono">10 Sep 2026</td>
                <td className="py-2.5 px-3 text-slate-700">Endocrinology OPD</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-teal-800">MedicationRequest</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">Synchronized</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  Comprehensive Metabolic Panel (CMP)
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-mono">10 Sep 2026</td>
                <td className="py-2.5 px-3 text-slate-700">Pathology Labs</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-teal-800">DiagnosticReport</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">Synchronized</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  General Medicine Follow-Up Encounter
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-mono">18 Apr 2026</td>
                <td className="py-2.5 px-3 text-slate-700">Internal Medicine</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-teal-800">Encounter</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">Synchronized</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  Cardiac Evaluation & 12-Lead ECG
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-mono">14 Nov 2024</td>
                <td className="py-2.5 px-3 text-slate-700">Cardiology Dept</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-teal-800">DiagnosticReport</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">Synchronized</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scope Note Required by prompt */}
      <div
        id="hms-scope-boundary-note"
        className="p-4 bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-700 space-y-1"
      >
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-slate-600" />
          <span>Integration Scope & Governance Note</span>
        </div>
        <p className="leading-relaxed">
          This integration operates under read-only FHIR pull semantics. Hospital clinical records are mirrored
          locally for longitudinal patient empowerment. Any modification made by the patient within this platform
          (e.g., self-reported symptoms or manual dosage notes) is strictly isolated as "Patient Manual Entry" and
          does NOT mutate the hospital's authoritative primary medical records.
        </p>
      </div>
    </div>
  );
};
