import React from 'react';
import { useRouter } from '../../../lib/router';
import { Server, Upload, PenLine, ArrowRight, ShieldCheck, FileCheck, ArrowLeft } from 'lucide-react';

export const PatientAddHubPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/patient')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
          Record Ingestion Channels
        </span>
        <h1 className="text-2xl font-bold text-slate-900">Add Medical Information</h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          Choose a data intake channel to expand Rahul's longitudinal record. Each channel carries an explicit
          cryptographic provenance signature and reliability rating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Option 1: HMS Import */}
        <div
          id="card-add-hms"
          onClick={() => navigate('/patient/add/hms')}
          className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200 group-hover:scale-105 transition-transform">
              <Server className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Hospital HMS Import</h2>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                High Reliability
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect to Demo General Hospital gateway to pull digitally authenticated prescriptions, laboratory CMP panels,
              and OPD visit notes.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
            <span>Import Hospital Records</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 2: Upload Document */}
        <div
          id="card-add-upload"
          onClick={() => navigate('/patient/add/upload')}
          className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Upload Document</h2>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                Medium Reliability
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload scanned prescriptions or external lab reports. Experience simulated OCR extraction with confidence
              indicators and interactive verification.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
            <span>Upload & Extract</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 3: Manual Entry */}
        <div
          id="card-add-manual"
          onClick={() => navigate('/patient/add/manual')}
          className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-300 group-hover:scale-105 transition-transform">
              <PenLine className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Manual Entry</h2>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                Patient-Reported
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log home vitals, symptoms, adverse side-effects, or personal observations directly into the timeline.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Enter Patient Notes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
