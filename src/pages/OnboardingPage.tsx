import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import { useHealthStore } from '../lib/health-store';
import { Navbar } from '../components/layout/Navbar';
import { DemoDisclaimerFooter } from '../components/common/DemoDisclaimerFooter';
import {
  User,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Calendar,
  HeartPulse,
  Activity,
  ShieldAlert,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { patientProfile, showToast } = useHealthStore();

  const [step, setStep] = useState<number>(1);

  // Form states pre-filled for Rahul Sharma
  const [basicInfo, setBasicInfo] = useState({
    name: patientProfile.name,
    age: patientProfile.age,
    gender: patientProfile.gender,
    bloodGroup: patientProfile.bloodGroup,
    phone: patientProfile.phone,
    emergencyName: patientProfile.emergencyContact.name,
    emergencyPhone: patientProfile.emergencyContact.phone,
  });

  const [conditions, setConditions] = useState({
    hasDiabetes: true,
    diabetesType: 'Type 2 Diabetes Mellitus',
    diabetesYear: '2021',
    currentHba1c: '8.1%',
    hasHypertension: true,
    hypertensionYear: '2023',
    currentBp: '146/92 mmHg',
    hasDyslipidemia: true,
  });

  const [history, setHistory] = useState({
    surgeries: 'None recorded',
    allergies: 'No known drug allergies (NKDA)',
    smoking: 'Non-smoker',
    alcohol: 'Occasional social alcohol consumption',
    familyHistory: 'Father: Type 2 Diabetes diagnosed at age 52; Mother: Hypertension',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    showToast('Initial health context confirmed. Redirecting to Patient Dashboard.');
    navigate('/patient');
  };

  const stepLabels = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Existing Conditions' },
    { num: 3, label: 'Major History' },
    { num: 4, label: 'Review & Coverage' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-100 text-teal-900 border border-teal-200">
            Initial Profile Initialization
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Establish Patient Health Context
          </h1>
          <p className="text-xs text-slate-600">
            Capturing baseline information to initialize your longitudinal record.
          </p>
        </div>

        {/* 4-Step Stepper */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      step === s.num
                        ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                        : step > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-medium text-center sm:text-left ${
                      step === s.num ? 'text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Stepper Content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 1: Patient Basic Demographics</h3>
                <p className="text-xs text-slate-500">
                  Pre-populated baseline demographics for verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age & Biological Sex</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={basicInfo.age}
                      onChange={(e) => setBasicInfo({ ...basicInfo, age: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                    />
                    <select
                      value={basicInfo.gender}
                      onChange={(e) => setBasicInfo({ ...basicInfo, gender: e.target.value as any })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={basicInfo.bloodGroup}
                    onChange={(e) => setBasicInfo({ ...basicInfo, bloodGroup: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    value={basicInfo.phone}
                    onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Person</label>
                  <input
                    type="text"
                    value={basicInfo.emergencyName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, emergencyName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={basicInfo.emergencyPhone}
                    onChange={(e) => setBasicInfo({ ...basicInfo, emergencyPhone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Existing Conditions with Conditional Fields */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 2: Existing Diagnosed Conditions</h3>
                <p className="text-xs text-slate-500">
                  Select existing conditions to open conditional clinical detail fields.
                </p>
              </div>

              {/* Diabetes block */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-slate-900">Diabetes Mellitus</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={conditions.hasDiabetes}
                    onChange={(e) => setConditions({ ...conditions, hasDiabetes: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </div>

                {conditions.hasDiabetes && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Specific Diagnosis</label>
                      <input
                        type="text"
                        value={conditions.diabetesType}
                        onChange={(e) => setConditions({ ...conditions, diabetesType: e.target.value })}
                        className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Year of Diagnosis</label>
                      <input
                        type="text"
                        value={conditions.diabetesYear}
                        onChange={(e) => setConditions({ ...conditions, diabetesYear: e.target.value })}
                        className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Latest Known HbA1c</label>
                      <input
                        type="text"
                        value={conditions.currentHba1c}
                        onChange={(e) => setConditions({ ...conditions, currentHba1c: e.target.value })}
                        className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Hypertension block */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-indigo-700" />
                    <span className="text-xs font-bold text-slate-900">Hypertension (High Blood Pressure)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={conditions.hasHypertension}
                    onChange={(e) => setConditions({ ...conditions, hasHypertension: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </div>

                {conditions.hasHypertension && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Year of Onset</label>
                      <input
                        type="text"
                        value={conditions.hypertensionYear}
                        onChange={(e) => setConditions({ ...conditions, hypertensionYear: e.target.value })}
                        className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Typical Blood Pressure</label>
                      <input
                        type="text"
                        value={conditions.currentBp}
                        onChange={(e) => setConditions({ ...conditions, currentBp: e.target.value })}
                        className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Major History */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 3: Major Past Medical History</h3>
                <p className="text-xs text-slate-500">
                  Record documented surgical interventions, known drug allergies, and social risk factors.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies & Adverse Drug Reactions</label>
                <input
                  type="text"
                  value={history.allergies}
                  onChange={(e) => setHistory({ ...history, allergies: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Past Surgeries & Hospitalizations</label>
                <input
                  type="text"
                  value={history.surgeries}
                  onChange={(e) => setHistory({ ...history, surgeries: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Family Medical History</label>
                <textarea
                  rows={2}
                  value={history.familyHistory}
                  onChange={(e) => setHistory({ ...history, familyHistory: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Review & Initial Coverage Assessment */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 4: Clinical Review & Medical History Coverage</h3>
                <p className="text-xs text-slate-500">
                  Review baseline context and coverage confidence prior to accessing longitudinal records.
                </p>
              </div>

              {/* Cautious review notice explicitly required by prompt */}
              <div
                id="onboarding-review-cautious-notice"
                className="p-4 bg-amber-50 rounded-lg border border-amber-300 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-amber-950">
                  <p className="font-bold">Important Notice Regarding Initial Medical Context</p>
                  <p className="leading-relaxed">
                    This profile is based on the information currently provided. It may not represent the patient's
                    complete lifetime medical history. You can add more records later.
                  </p>
                </div>
              </div>

              {/* Initial Medical History Coverage Table explicitly required by prompt */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Initial Medical History Coverage
                </h4>
                <div className="overflow-hidden border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Coverage Domain</th>
                        <th className="py-2.5 px-4">Coverage Status</th>
                        <th className="py-2.5 px-4">Confidence Level</th>
                        <th className="py-2.5 px-4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">Basic Information</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Complete
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">100% Verified</td>
                        <td className="py-2.5 px-4 text-slate-500">Demographics, emergency contact, identifiers.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">Known Conditions</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            Available
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">Primary Chronic</td>
                        <td className="py-2.5 px-4 text-slate-500">Type 2 Diabetes (2021), HTN (2023).</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">Medication History</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Partial
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">Recent Records</td>
                        <td className="py-2.5 px-4 text-slate-500">Hospital prescriptions synced; historical gap 2021–2022.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">Past Medical Events</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            Limited
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">Self-Reported</td>
                        <td className="py-2.5 px-4 text-slate-500">Selective hospital checkups logged.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">Supporting Documents</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            Partial
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">4 Attached</td>
                        <td className="py-2.5 px-4 text-slate-500">Prescription scans, USG report, lab sheets.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-confirm-initial-context"
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Confirm Initial Health Context</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      <DemoDisclaimerFooter />
    </div>
  );
};
