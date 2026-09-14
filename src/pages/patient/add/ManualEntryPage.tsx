import React, { useState } from 'react';
import { useRouter } from '../../../lib/router';
import { useHealthStore } from '../../../lib/health-store';
import {
  PenLine,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Activity,
  Pill,
  HeartPulse,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const ManualEntryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { addManualEntry } = useHealthStore();

  const [entryType, setEntryType] = useState<'Symptom Report' | 'Medication' | 'Vital Measurement' | 'Clinical Encounter'>('Symptom Report');

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');

  // Symptom-specific
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [onsetDate, setOnsetDate] = useState('2026-09-12');
  const [relatedMedication, setRelatedMedication] = useState('Metformin Hydrochloride 500mg');

  const populateDemoManualEntry = () => {
    setEntryType('Symptom Report');
    setTitle('Patient Symptom Report: Epigastric Discomfort & Mild Nausea');
    setSummary('Patient logged mild stomach discomfort and nausea occurring ~1 hour following evening Metformin dose.');
    setDetails('Onset observed 2 days following initiation of Metformin 500mg. No vomiting or diarrhea. Symptoms ease with food intake.');
    setSeverity('Mild');
    setOnsetDate('2026-09-11');
    setRelatedMedication('Metformin Hydrochloride 500mg');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addManualEntry({
      title,
      category: entryType,
      summary,
      details,
      symptomData:
        entryType === 'Symptom Report'
          ? {
              symptom: title,
              severity,
              onsetDate,
              notes: details,
              relatedMedicationName: relatedMedication,
              temporalCorrelationText: `Possible temporal association detected: Reported stomach discomfort occurred within 48 hours of ${relatedMedication} initiation. Metformin is known to cause transient gastrointestinal discomfort during initial titration.`,
            }
          : undefined,
    });

    navigate('/patient/timeline');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('/patient/add')}
        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Channels</span>
      </button>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300">
                Patient Direct Entry
              </span>
              <span className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-medium">
                Reliability: Low (Self-Reported)
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">Add Manual Clinical Entry</h1>
            <p className="text-xs text-slate-500 mt-1">
              Log symptoms, home measurements, or personal notes to your health record.
            </p>
          </div>

          {/* Quick Demo Pre-fill Button */}
          <button
            type="button"
            id="btn-use-demo-manual-entry"
            onClick={populateDemoManualEntry}
            className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Use Demo Manual Entry (Stomach Discomfort)</span>
          </button>
        </div>

        {/* Entry Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Entry Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'Symptom Report', label: 'Symptom / Side Effect', icon: AlertCircle },
              { id: 'Medication', label: 'Medication Note', icon: Pill },
              { id: 'Vital Measurement', label: 'Vital / Reading', icon: HeartPulse },
              { id: 'Clinical Encounter', label: 'General Note', icon: Activity },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setEntryType(t.id as any)}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                    entryType === t.id
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Entry Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Mild stomach discomfort after Metformin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-teal-600 text-xs font-medium text-slate-900"
            />
          </div>

          {entryType === 'Symptom Report' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full p-2 rounded border border-slate-300 bg-white"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date of Onset</label>
                <input
                  type="date"
                  value={onsetDate}
                  onChange={(e) => setOnsetDate(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Associated Medication</label>
                <input
                  type="text"
                  value={relatedMedication}
                  onChange={(e) => setRelatedMedication(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Summary Observation</label>
            <input
              type="text"
              required
              placeholder="Brief summary statement"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-teal-600 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Notes & Context</label>
            <textarea
              rows={3}
              placeholder="Additional information, circumstances, or feelings..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-teal-600 text-xs text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Manual entries are preserved for patient history and clinical review.
            </span>

            <button
              type="submit"
              id="btn-save-manual-entry"
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Entry to Timeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
