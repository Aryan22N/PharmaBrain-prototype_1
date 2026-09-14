import React from 'react';
import { useRouter } from '../../lib/router';
import { Navbar } from '../../components/layout/Navbar';
import { DemoDisclaimerFooter } from '../../components/common/DemoDisclaimerFooter';
import {
  Stethoscope,
  ShieldCheck,
  Search,
  FileText,
  ArrowRight,
  UserCheck,
  Activity,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const DoctorNavHubPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hub Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Clinician Portal
              </span>
              <span className="text-xs text-slate-500 font-mono">Gateway: ABDM Health Provider Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Physician Consultation & Verification Hub
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Active Provider Session: <strong>Dr. Priya Deshmukh, MD (Endocrinology)</strong> • Demo General Hospital
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-right">
            <div className="text-slate-500">MCI Registration</div>
            <div className="font-mono font-bold text-slate-800">MCI-2012-7721</div>
          </div>
        </div>

        {/* Clinical Alert Card */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Pending Patient Review: Rahul Sharma (MRN: MRN-2024-8841)</span>
            <p className="leading-relaxed">
              Patient has granted 24-hour read access for follow-up review. An active clinical discrepancy regarding
              Metformin titration requires physician reconciliation.
            </p>
          </div>
        </div>

        {/* Portal Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Consent Verification */}
          <div
            id="card-doctor-verify"
            onClick={() => navigate('/doctor/verify')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">1. Verify Patient Access</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter patient MRN and consent PIN to validate cryptographic access grant before unlocking clinical records.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>Open Verification Form</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Clinical Dashboard */}
          <div
            id="card-doctor-dashboard"
            onClick={() => navigate('/doctor/dashboard')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">2. Clinical Dashboard</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct view of Rahul Sharma's longitudinal records, conflicting dosage alert, vitals trends, and medication reconciliation.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
              <span>Access Patient Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Query Assistant */}
          <div
            id="card-doctor-query"
            onClick={() => navigate('/doctor/dashboard/query')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">3. Record Analysis Assistant</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interact with clinical queries regarding glycemic control, medication conflict analysis, and coverage gaps.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700">
              <span>Launch Clinical Assistant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </main>

      <DemoDisclaimerFooter />
    </div>
  );
};
