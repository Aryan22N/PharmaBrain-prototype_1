import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';

export const DemoDisclaimerFooter: React.FC = () => {
  return (
    <footer id="app-disclaimer-footer" className="mt-12 pt-6 pb-8 border-t border-slate-200 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-100/70 p-4 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">
                Academic MVP Demonstration Prototype — Non-Diagnostic Environment
              </p>
              <p className="text-slate-600 leading-relaxed max-w-4xl">
                All patient profiles, clinical entries, diagnostic values, and hospital references (Rahul Sharma, DEMO-P001,
                Demo General Hospital) are strictly synthetic dummy data designed to demonstrate record provenance, multi-tiered
                verification, and patient-controlled data sharing. This system does not deliver real medical care or algorithmic diagnosis.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-[11px] font-medium text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>FHIR R4 / ABDM Compatible Architecture</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Patient-Centric Digital Medical Record Demo MVP • September 2026 Reference</span>
          <span>Dummy Data Sandbox • In-Browser React State Persistence</span>
        </div>
      </div>
    </footer>
  );
};
