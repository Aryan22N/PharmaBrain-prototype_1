import React, { useState, useEffect } from 'react';
import { useRouter } from '../../../lib/router';
import { useHealthStore } from '../../../lib/health-store';
import { SAMPLE_PRESCRIPTION_IMAGE } from './DocumentUploadPage';
import { fallbackMockResult, AnalysisResult } from '../../../lib/gemini-analysis';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Check,
  Edit2,
  XCircle,
  Stethoscope,
  ShieldAlert,
  HelpCircle,
  Scan,
  Activity,
  FileCheck,
  Info
} from 'lucide-react';

export const ExtractedReviewPage: React.FC = () => {
  const { navigate } = useRouter();
  const { pendingUploadImage, pendingAnalysisResult, confirmExtractedData, showToast } = useHealthStore();

  const activeImage = pendingUploadImage || SAMPLE_PRESCRIPTION_IMAGE;
  const analysis: AnalysisResult = pendingAnalysisResult || fallbackMockResult;

  const [documentTitle, setDocumentTitle] = useState('Prescription_OCR_14Sep2026.pdf');
  const [facility, setFacility] = useState(analysis.facility || 'Not specified in document');
  const [doctorName, setDoctorName] = useState(analysis.doctorName || 'Not specified in document');
  const [reference, setReference] = useState(`DOC-OCR-${Date.now().toString().slice(-6)}`);
  const [medications, setMedications] = useState(analysis.medicines || []);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (pendingAnalysisResult) {
      setFacility(pendingAnalysisResult.facility || 'Not specified in document');
      setDoctorName(pendingAnalysisResult.doctorName || 'Not specified in document');
      setMedications(pendingAnalysisResult.medicines || []);
    }
  }, [pendingAnalysisResult]);

  const handleConfirm = () => {
    if (medications.length === 0) {
      showToast('No medications to commit from this document.');
      navigate('/patient/documents');
      return;
    }

    confirmExtractedData(
      documentTitle,
      medications.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.instructions,
        route: 'Oral',
        indication: 'Prescribed Regimen',
      })),
      doctorName,
      facility,
      reference
    );
    navigate('/patient/medicines');
  };

  const handleReject = () => {
    showToast('Extracted OCR document draft discarded.');
    navigate('/patient/add/upload');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/add/upload')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Upload</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Ref: {reference}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
            OCR Verification Ready
          </span>
        </div>
      </div>

      {/* OCR Status Banner (Strictly labeled as OCR in UI, no Gemini mention) */}
      <div
        id="ocr-extraction-banner"
        className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 flex items-start gap-3.5 shadow-xs"
      >
        <Scan className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-teal-950">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Neural OCR Document Analysis — Output Review</span>
            <span className="bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              OCR Engine
            </span>
          </div>
          <p className="leading-relaxed text-teal-900">
            OCR layout parser scanned document structure and extracted clinical text, prescribing doctor information, medication schedules, and clinical risk observations.
          </p>
        </div>
      </div>

      {/* Two-Column Layout: Document Image Output on Left, Structured Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Output & Visual Document Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-700" />
                Uploaded Document Image Output
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Image Preview</span>
            </div>

            {/* Document Image Preview Container */}
            <div className="bg-slate-900 rounded-lg p-2 border border-slate-700 overflow-hidden flex items-center justify-center max-h-[560px]">
              <img
                src={activeImage}
                alt="Uploaded Medical Document Preview"
                className="max-h-[540px] w-full object-contain rounded bg-white shadow-md"
              />
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>OCR Processing Mode</span>
                <span className="text-teal-700">Vision & Entity Extraction</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Document artifacts preserved for verification audit trail.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Structured OCR Results & Clinical Disease Predictions */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prescribing Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                Document Summary & Prescribing Details
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Edit Info'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Prescribing Doctor</label>
                <input
                  disabled={!isEditing}
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-slate-50 disabled:bg-slate-50 text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Facility / Clinic</label>
                <input
                  disabled={!isEditing}
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-slate-50 disabled:bg-slate-50 text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs text-teal-950 font-medium leading-relaxed">
              <span className="font-bold text-teal-900">Summary: </span>
              {analysis.summary}
            </div>
          </div>

          {/* Prescribed Medications Card List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Prescribed Medication Entities ({medications.length})
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Extracted via OCR
              </span>
            </div>

            {medications.length === 0 ? (
              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1.5">
                <Info className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No Prescribed Medications Detected</p>
                <p className="text-[11px] text-slate-500">
                  The uploaded image does not contain readable medication items or prescription orders.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      {isEditing ? (
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => {
                            const copy = [...medications];
                            copy[idx].name = e.target.value;
                            setMedications(copy);
                          }}
                          className="p-1 rounded border border-slate-300 font-bold text-slate-900 text-sm"
                        />
                      ) : (
                        <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                      )}

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                        OCR Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-slate-700">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Dosage</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => {
                              const copy = [...medications];
                              copy[idx].dosage = e.target.value;
                              setMedications(copy);
                            }}
                            className="w-full p-1 text-xs rounded border border-slate-300"
                          />
                        ) : (
                          <span className="font-semibold text-slate-900">{med.dosage}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Duration</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => {
                              const copy = [...medications];
                              copy[idx].duration = e.target.value;
                              setMedications(copy);
                            }}
                            className="w-full p-1 text-xs rounded border border-slate-300"
                          />
                        ) : (
                          <span className="font-semibold text-slate-900">{med.duration}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Timing / Instructions</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={med.instructions}
                            onChange={(e) => {
                              const copy = [...medications];
                              copy[idx].instructions = e.target.value;
                              setMedications(copy);
                            }}
                            className="w-full p-1 text-xs rounded border border-slate-300"
                          />
                        ) : (
                          <span className="font-semibold text-slate-900">{med.instructions}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Potential Diseases & Clinical Risk Assessment Section */}
          <div className="bg-gradient-to-r from-amber-50/80 via-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-amber-200/80 pb-2">
              <Activity className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-amber-950">
                Potential Diseases & Clinical Risk Assessment
              </h3>
            </div>

            <p className="text-xs text-amber-900 leading-relaxed">
              Based on the extracted document content, the OCR analyzer evaluates potential health conditions or risk indicators:
            </p>

            {analysis.potentialDiseases.length === 0 ? (
              <div className="p-3.5 bg-white/90 rounded-lg border border-amber-200 text-xs text-amber-950 font-medium">
                No potential disease indicators or health risk factors identified in this document.
              </div>
            ) : (
              <div className="space-y-2">
                {analysis.potentialDiseases.map((disease, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white/90 rounded-lg border border-amber-200 flex items-start gap-2.5 text-xs text-slate-800 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold leading-relaxed text-slate-900">{disease}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Precautions & Clinical Key Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Precautions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Precautions</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.precautions.length === 0 ? (
                  <li className="text-slate-500 italic">No specific precautions indicated for this document.</li>
                ) : (
                  analysis.precautions.map((prec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold text-sm">•</span>
                      <span>{prec}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Questions for Doctor */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                <HelpCircle className="w-4 h-4 text-teal-700" />
                <span>Questions for Doctor</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.questionsForDoctor.length === 0 ? (
                  <li className="text-slate-500 italic">No follow-up questions generated.</li>
                ) : (
                  analysis.questionsForDoctor.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold text-sm">?</span>
                      <span>{q}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-[11px] text-slate-600 italic">
            <strong>Disclaimer: </strong> {analysis.disclaimer}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-rose-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Discard & Re-scan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Edit Extracted Data'}
              </button>

              <button
                type="button"
                id="btn-confirm-extracted-record"
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Commit to Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
