import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useHealthStore } from '../../lib/health-store';
import {
  Search,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  FileText,
  CheckCircle2,
  Send,
  HelpCircle,
  Brain,
  ShieldAlert,
} from 'lucide-react';

interface QueryResponse {
  query: string;
  summary: string;
  keyFindings: string[];
  clinicalRecommendation: string;
  groundedReferences: string[];
}

export const DoctorQueryAssistantPage: React.FC = () => {
  const { navigate } = useRouter();

  const suggestedQueries = [
    {
      title: 'Glycemic Control & Adherence',
      prompt: 'Summarize glycemic control trend and medication adherence',
    },
    {
      title: 'Medication Conflict Analysis',
      prompt: 'Analyze medication conflict: Metformin 500mg vs 1000mg',
    },
    {
      title: 'Symptom & Prescription Temporal Correlation',
      prompt: 'Evaluate reported symptoms in relation to recent prescriptions',
    },
    {
      title: 'Medical History Coverage Gaps',
      prompt: 'Identify gaps in medical history coverage',
    },
  ];

  // Pre-computed clinical-grade answers grounded in Rahul Sharma's dataset
  const prebuiltAnswers: Record<string, QueryResponse> = {
    'Summarize glycemic control trend and medication adherence': {
      query: 'Summarize glycemic control trend and medication adherence',
      summary:
        "Longitudinal analysis of Rahul Sharma's record demonstrates progressive glycemic escalation over a 26-month observation window. HbA1c has climbed from 7.2% (July 2024) to 8.1% (August 2026), accompanied by parallel rises in fasting plasma glucose from 132 mg/dL (December 2023) to 168 mg/dL (August 2026).",
      keyFindings: [
        'HbA1c increased by +0.9% over 2 years (target: < 7.0%).',
        'Fasting glucose consistently elevated above 150 mg/dL throughout 2025 and 2026.',
        'Metformin 500 mg BID was initiated on 10 September 2026 by Dr. Priya Deshmukh to address glycemic escape.',
        'Patient reports high adherence to Telmisartan 40mg with no omitted doses noted.',
      ],
      clinicalRecommendation:
        'Re-evaluate HbA1c in 12 weeks. If Metformin 500mg BID is tolerated after initial titration, consider titrating to 1000mg BID or introducing a secondary agent (e.g., SGLT2 inhibitor) pending renal function evaluation.',
      groundedReferences: [
        'LAB-CMP-2026-0822 (Apex Diagnostic)',
        'HMS-PRESCRIPTION-2026-0910 (Demo General Hospital)',
        'LAB-GLUCOSE-2023-12 (Historic Panel)',
      ],
    },
    'Analyze medication conflict: Metformin 500mg vs 1000mg': {
      query: 'Analyze medication conflict: Metformin 500mg vs 1000mg',
      summary:
        "A provenance-level conflict exists between Hospital HMS order HMS-PRESCRIPTION-2026-0910 (500 mg BID) and patient self-entry MAN-2026-0911 (1000 mg). Deterministic priority rules established Hospital HMS as the authoritative reference.",
      keyFindings: [
        'HMS Record (Authoritative): Prescribed by Dr. Priya Deshmukh on 10 Sep 2026 as Metformin 500 mg BID after food.',
        'Patient Manual Record (Self-Reported): Logged on 11 Sep 2026 as 1000 mg dose.',
        'Root Cause: Likely cognitive confusion between cumulative daily dose (500mg x 2 = 1000mg total daily) vs single-tablet strength (500mg per unit).',
        'Clinical Priority: Hospital record displayed as primary active regimen; patient entry retained for longitudinal audit.',
      ],
      clinicalRecommendation:
        'Counsel patient to clarify that the prescribed dose is one 500mg tablet twice daily (morning and night), totaling 1000mg per day, to prevent accidental double-dosing.',
      groundedReferences: [
        'HMS-PRESCRIPTION-2026-0910 (FHIR MedicationRequest)',
        'MAN-2026-0911 (Patient Direct Portal Entry)',
      ],
    },
    'Evaluate reported symptoms in relation to recent prescriptions': {
      query: 'Evaluate reported symptoms in relation to recent prescriptions',
      summary:
        'Temporal sequence analysis reveals high correlation between initiation of oral biguanide therapy (Metformin) and patient-reported upper gastrointestinal symptoms.',
      keyFindings: [
        '10 Sep 2026: Metformin 500 mg BID initiated.',
        '11 Sep 2026 (~24 hours post-first dose): Patient logged epigastric discomfort, fullness, and mild nausea occurring ~1 hour post-dose.',
        'Severity: Mild; symptoms eased when taken strictly in the middle of meals.',
        'Known Clinical Profile: Metformin commonly induces transient gastrointestinal intolerance in ~20-30% of patients during the first 1-2 weeks of titration.',
      ],
      clinicalRecommendation:
        'Reassure patient that symptoms typically subside within 10-14 days. Emphasize taking the tablet in the middle of a substantial meal. Consider extended-release (XR) formulation if discomfort persists.',
      groundedReferences: [
        'PRO-SYM-2026-0911 (Patient Reported Outcome)',
        'HMS-PRESCRIPTION-2026-0910 (Prescription Order)',
      ],
    },
    'Identify gaps in medical history coverage': {
      query: 'Identify gaps in medical history coverage',
      summary:
        'Longitudinal coverage analysis indicates satisfactory coverage (70%) for core chronic conditions (Type 2 DM, HTN), but identifies key surveillance gaps in microvascular complications.',
      keyFindings: [
        'Surveillance Gap: No documented ophthalmology retinal fundus photography exam within the 7-year record.',
        'Renal Surveillance: Urine microalbumin-to-creatinine ratio (uACR) is absent from the latest CMP lab panel.',
        'Temporal Gap: Limited outpatient lab records between November 2021 and December 2023.',
        'Vaccination History: Adult pneumococcal and annual influenza vaccinations not currently recorded.',
      ],
      clinicalRecommendation:
        'Order dilated eye fundoscopy for diabetic retinopathy screening, and schedule spot urine albumin-to-creatinine ratio (uACR) alongside routine serum creatinine.',
      groundedReferences: [
        'ABDM-COV-ASSESS-2026 (Coverage Evaluation Matrix)',
        'HIST-OUTPATIENT-2021 (Initial Diagnostic Encounter)',
      ],
    },
  };

  const [inputQuery, setInputQuery] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState<QueryResponse | null>(
    prebuiltAnswers['Summarize glycemic control trend and medication adherence']
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectQuery = (prompt: string) => {
    setInputQuery(prompt);
    setIsAnalyzing(true);
    setTimeout(() => {
      setActiveAnalysis(prebuiltAnswers[prompt] || prebuiltAnswers['Summarize glycemic control trend and medication adherence']);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      // Find matching or default to relevant clinical summary
      const matchKey = Object.keys(prebuiltAnswers).find((k) =>
        inputQuery.toLowerCase().includes(k.toLowerCase().slice(0, 15))
      );
      setActiveAnalysis(
        matchKey
          ? prebuiltAnswers[matchKey]
          : {
              query: inputQuery,
              summary: `Clinical synthesis regarding "${inputQuery}" evaluated across 14 synchronized records for Rahul Sharma. Longitudinal patterns show stable hypertension under Telmisartan 40mg and evolving Type 2 Diabetes under Metformin 500mg BID.`,
              keyFindings: [
                'Grounded across 7 years of outpatient encounters and lab panels.',
                'Cross-checked against authoritative Hospital HMS orders and patient-reported outcomes.',
                'Prioritizes hospital-verified clinical evidence over unverified patient notes.',
              ],
              clinicalRecommendation:
                'Review full longitudinal timeline for detailed laboratory breakdown and discuss symptom tolerance during next follow-up visit.',
              groundedReferences: ['HMS-PRESCRIPTION-2026-0910', 'LAB-CMP-2026-0822'],
            }
      );
      setIsAnalyzing(false);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Doctor Dashboard</span>
        </button>

        <span className="text-xs font-mono text-slate-500">Patient: Rahul Sharma (MRN-2024-8841)</span>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
            Clinical Decision Support
          </span>
          <span className="text-xs text-slate-500 font-mono">Model: ABDM Record Synthesizer v2.4</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          Record Analysis Assistant (Doctor Decision Support)
        </h1>
        <p className="text-xs text-slate-600">
          Synthesize complex longitudinal records into structured clinical findings, medication reconciliation checks,
          and temporal symptom correlations.
        </p>
      </div>

      {/* Suggested Queries Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Suggested Clinical Queries (Click to Run)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedQueries.map((q) => (
            <button
              key={q.title}
              type="button"
              onClick={() => handleSelectQuery(q.prompt)}
              className="p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all shadow-xs cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 flex items-center justify-between">
                <span>{q.title}</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 opacity-70 group-hover:opacity-100" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{q.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleCustomSubmit} className="relative">
        <input
          type="text"
          placeholder="Ask a question about Rahul's medical history, lab trajectories, or medication adherence..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="w-full pl-10 pr-24 py-3 bg-white rounded-xl border border-slate-300 text-xs shadow-xs focus:outline-indigo-600 font-medium text-slate-900"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <button
          type="submit"
          disabled={isAnalyzing || !inputQuery.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Analyze</span>
          <Send className="w-3 h-3" />
        </button>
      </form>

      {/* Analysis Output Result Card */}
      {isAnalyzing ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-3 text-center">
          <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
          <p className="text-xs font-semibold text-slate-700">
            Synthesizing longitudinal EHR records and checking provenance references...
          </p>
        </div>
      ) : activeAnalysis ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          {/* Query Header */}
          <div className="border-b border-slate-100 pb-3 flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                Analysis Synthesis
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">{activeAnalysis.query}</h2>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
              Grounded in Patient Data
            </span>
          </div>

          {/* Synthesis Narrative */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800">Executive Clinical Summary</span>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {activeAnalysis.summary}
            </p>
          </div>

          {/* Key Findings List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800">Key Structured Findings</span>
            <ul className="space-y-1.5 text-xs">
              {activeAnalysis.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Recommendation */}
          <div className="p-3.5 bg-indigo-50/60 rounded-lg border border-indigo-200 text-xs space-y-1">
            <span className="font-bold text-indigo-950 block">Physician Decision-Support Recommendation</span>
            <p className="text-indigo-900 leading-relaxed">{activeAnalysis.clinicalRecommendation}</p>
          </div>

          {/* Grounded References Provenance */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
            <span>Authoritative Source Records Grounded:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeAnalysis.groundedReferences.map((ref) => (
                <span key={ref} className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mandatory Disclaimer explicitly required by prompt */}
      <div
        id="query-assistant-disclaimer"
        className="p-4 bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-600 flex items-start gap-3"
      >
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800">Clinical Governance & Decision Responsibility Disclaimer</span>
          <p className="leading-relaxed">
            Record Analysis Assistant provides decision-support summaries based strictly on recorded data. All
            clinical decisions remain the responsibility of the treating physician.
          </p>
        </div>
      </div>
    </div>
  );
};
