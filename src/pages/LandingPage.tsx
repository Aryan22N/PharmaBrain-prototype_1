import React from 'react';
import { useRouter } from '../lib/router';
import { useHealthStore } from '../lib/health-store';
import { Navbar } from '../components/layout/Navbar';
import { DemoDisclaimerFooter } from '../components/common/DemoDisclaimerFooter';
import {
  User,
  Stethoscope,
  ShieldCheck,
  GitMerge,
  Share2,
  ArrowRight,
  Database,
  Building2,
  FileCheck2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { resetDemoData } = useHealthStore();

  const handleStartPatientDemo = () => {
    navigate('/patient');
  };

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  const handleStartDoctorDemo = () => {
    navigate('/doctor');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Main hero */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FHIR R4 & ABDM Aligned Healthcare Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Patient-Centric Digital Medical Record
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A trusted longitudinal health record that preserves full source provenance, resolves conflicting entries,
            and enables granular patient-governed data sharing between hospitals, clinics, and physicians.
          </p>

          {/* Quick Action CTA buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-open-patient-profile"
              onClick={handleStartPatientDemo}
              className="w-full sm:w-auto px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-sm text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Open Demo Patient Profile (Rahul Sharma)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-open-doctor-access"
              onClick={handleStartDoctorDemo}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold rounded-lg shadow-xs text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              <span>Doctor Demo Access</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              id="btn-view-onboarding-flow"
              onClick={handleStartOnboarding}
              className="text-xs text-slate-500 hover:text-teal-700 underline font-medium"
            >
              Explore Initial Patient Onboarding Flow (4 Steps) →
            </button>
          </div>
        </div>

        {/* 3 Core Feature Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Unified Records with Complete Provenance
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every prescription, lab result, and doctor note links back to its verified institutional reference, original
              document artifact, or self-reported audit trail.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>HMS-PRESCRIPTION-2026-0910</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <GitMerge className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Reliable Source Hierarchy & Conflict Detection
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear priority rules rank Hospital HMS over unverified entries while preserving both for history. Flag
              conflicting dosages (e.g. Metformin 500mg vs 1000mg) for clinician review.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Automated Discrepancy Flagging</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Granular Sharing & Doctor Review Layout
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patients selectively authorize access to specific clinical categories with timed revocation. Physicians
              receive high-density synthesis layouts tailored for fast clinical review.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-medium text-teal-800">
              <Lock className="w-3.5 h-3.5" />
              <span>Patient-Controlled Cryptographic Consent</span>
            </div>
          </div>
        </div>

        {/* Academic MVP Note Card */}
        <div className="mt-10 p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <FileCheck2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-800">Academic MVP Prototype Demonstration Architecture</span>
            <p className="leading-relaxed">
              This application functions entirely in-browser using realistic synthetic clinical data for Rahul Sharma
              (42M, Type 2 Diabetes, Essential HTN). It models FHIR R4 resource mapping, simulated OCR document extraction,
              ABDM gateway integration, and deterministic record query synthesis without external cloud dependencies.
            </p>
          </div>
        </div>
      </main>

      <DemoDisclaimerFooter />
    </div>
  );
};
