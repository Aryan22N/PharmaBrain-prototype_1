import React, { useState } from 'react';
import { useHealthStore } from '../../lib/health-store';
import { SourceBadge } from '../../components/common/SourceBadge';
import { ReliabilityBadge } from '../../components/common/ReliabilityBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { Pill, AlertTriangle, CheckCircle2, Calendar, Building, UserCheck, ShieldCheck } from 'lucide-react';

export const PatientMedicinesPage: React.FC = () => {
  const { medications } = useHealthStore();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ALL'>('ACTIVE');

  const activeMeds = medications.filter((m) => m.isActive);
  const displayedMeds = activeTab === 'ACTIVE' ? activeMeds : medications;

  const hasConflict = medications.some((m) => m.isConflict);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Current Recorded Medicines</h1>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
              {activeMeds.length} Active Prescriptions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reconciled medication list with source attribution, prescribing physician, and original reference identifiers.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'ACTIVE' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Regimen ({activeMeds.length})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Historical ({medications.length})
          </button>
        </div>
      </div>

      {/* Conflict Notice if present */}
      {hasConflict && (
        <div
          id="meds-conflict-callout"
          className="p-4 bg-amber-50 rounded-xl border border-amber-300 shadow-xs flex items-start gap-3.5"
        >
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-950">
            <span className="font-bold text-sm">Medication Dosage Discrepancy Flagged</span>
            <p className="leading-relaxed">
              Conflicting information detected — Hospital HMS record is shown as the higher-priority source. The
              patient-entered record has been retained for history.
            </p>
            <div className="pt-1 text-[11px] text-amber-800 font-mono">
              Prescribed: Metformin 500 mg BID (Dr. Priya Deshmukh) vs Patient manual note: 1000 mg.
            </div>
          </div>
        </div>
      )}

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedMeds.map((med) => {
          return (
            <div
              key={med.id}
              className={`p-5 rounded-xl border shadow-xs transition-all space-y-3.5 ${
                med.isConflict
                  ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
                  : med.isActive
                  ? 'bg-white border-slate-200 hover:border-teal-300'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{med.name}</span>
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{med.indication}</div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    med.isActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {med.isActive ? 'Active' : 'Discontinued'}
                </span>
              </div>

              {/* Instructions & Route */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span>Frequency: {med.frequency}</span>
                  <span className="font-mono text-slate-500">Route: {med.route}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Start Date: {med.startDate}</span>
                  {med.endDate && <span>• End Date: {med.endDate}</span>}
                </div>
              </div>

              {/* Prescriber & Provenance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{med.prescribedBy}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate font-mono text-[11px] text-slate-500">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{med.originalReference}</span>
                </div>
              </div>

              {/* Conflict Callout block inside card */}
              {med.isConflict && med.conflictDescription && (
                <div className="p-2 bg-amber-100/70 rounded text-[11px] text-amber-900 border border-amber-200">
                  {med.conflictDescription}
                </div>
              )}

              {/* Three Badges Family */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                <SourceBadge source={med.source} size="sm" />
                <ReliabilityBadge level={med.reliability} size="sm" />
                <VerificationBadge status={med.verification} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
