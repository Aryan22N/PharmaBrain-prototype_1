git remote add origin https://github.com/Aryan22N/PharmaBrain-prototype_1.gitimport React, { useState } from 'react';
import { useRouter } from '../../../lib/router';
import { useHealthStore } from '../../../lib/health-store';
import { analyseFile } from '../../../lib/gemini-analysis';
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Sparkles,
  FileCheck,
  Scan,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const SAMPLE_PRESCRIPTION_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
  <rect width="600" height="750" fill="#F8FAFC" rx="16"/>
  <rect x="24" y="24" width="552" height="702" fill="white" stroke="#CBD5E1" stroke-width="2" rx="12"/>
  <path d="M24 24H576V110H24V24Z" fill="#0F172A" rx="12"/>
  <text x="50" y="65" fill="#38BDF8" font-family="sans-serif" font-size="22" font-weight="bold">MEDICAL CENTRE</text>
  <text x="50" y="90" fill="#94A3B8" font-family="sans-serif" font-size="12">824 14th St, New York, NY • Tel: (212) 555-0199</text>
  <text x="50" y="145" fill="#0F172A" font-family="sans-serif" font-size="14" font-weight="bold">Prescribing Physician: Dr. Steve Johnson</text>
  <text x="50" y="165" fill="#64748B" font-family="sans-serif" font-size="12">Department of Internal Medicine</text>
  <line x1="50" y1="185" x2="550" y2="185" stroke="#E2E8F0" stroke-width="2"/>
  <text x="50" y="215" fill="#0F172A" font-family="sans-serif" font-size="12">Patient Name: <tspan font-weight="bold">Patient Sample</tspan></text>
  <text x="320" y="215" fill="#0F172A" font-family="sans-serif" font-size="12">Date: <tspan font-weight="bold">14 Sep 2026</tspan></text>
  <rect x="50" y="250" width="500" height="390" fill="#F1F5F9" rx="8" stroke="#E2E8F0"/>
  <text x="70" y="290" fill="#0D9488" font-family="sans-serif" font-size="28" font-weight="bold">Rx</text>
  <text x="85" y="330" fill="#0F172A" font-family="sans-serif" font-size="14" font-weight="bold">1. Betaloc 50mg</text>
  <text x="105" y="350" fill="#475569" font-family="sans-serif" font-size="12">Sig: Take 1 tablet daily (QD) after breakfast</text>
  <text x="85" y="390" fill="#0F172A" font-family="sans-serif" font-size="14" font-weight="bold">2. Oxprelol 20mg</text>
  <text x="105" y="410" fill="#475569" font-family="sans-serif" font-size="12">Sig: Take 1 tablet twice daily (BID)</text>
  <text x="85" y="450" fill="#0F172A" font-family="sans-serif" font-size="14" font-weight="bold">3. Dorzolamidum 2% Ophthalmic Drops</text>
  <text x="105" y="470" fill="#475569" font-family="sans-serif" font-size="12">Sig: 1 drop in affected eye twice daily (BID)</text>
  <text x="85" y="510" fill="#0F172A" font-family="sans-serif" font-size="14" font-weight="bold">4. Cimetidine 400mg</text>
  <text x="105" y="530" fill="#475569" font-family="sans-serif" font-size="12">Sig: Take 1 tablet three times daily (TID) before meals</text>
  <line x1="50" y1="660" x2="550" y2="660" stroke="#CBD5E1" stroke-width="1"/>
  <text x="360" y="695" fill="#0F172A" font-family="sans-serif" font-size="14" font-style="italic" font-weight="bold">Dr. Steve Johnson</text>
</svg>
`)}`;

export const DocumentUploadPage: React.FC = () => {
  const { navigate } = useRouter();
  const { setPendingUpload, showToast } = useHealthStore();

  const [documentType, setDocumentType] = useState<'PRESCRIPTION' | 'REPORT'>('PRESCRIPTION');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processingMessages = [
    'Scanning document text, structure & bounding boxes with OCR...',
    'Analyzing clinical entities, dosages & prescribing physician info...',
    'Evaluating potential disease indications & clinical risk factors...',
  ];

  const processImageFile = async (base64Data: string, mimeType: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStage(0);

    const stageTimer1 = setTimeout(() => setProcessingStage(1), 700);
    const stageTimer2 = setTimeout(() => setProcessingStage(2), 1500);

    try {
      const { result } = await analyseFile(base64Data, mimeType, documentType);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      setPendingUpload(base64Data, result);
      setIsProcessing(false);
      navigate('/patient/add/review');
    } catch (err: any) {
      console.error('OCR Processing error:', err);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsProcessing(false);
      setErrorMessage('OCR analysis failed to parse document. Please try again.');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      processImageFile(base64Data, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        processImageFile(base64Data, file.type || 'image/jpeg');
      };
      reader.readAsDataURL(file);
    } else {
      triggerDemoUpload();
    }
  };

  const triggerDemoUpload = () => {
    processImageFile(SAMPLE_PRESCRIPTION_IMAGE, 'image/svg+xml');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('/patient/add')}
        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Channels</span>
      </button>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
              <Scan className="w-3.5 h-3.5 text-teal-600" />
              Smart OCR Document Intake
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              High Accuracy OCR
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Upload Medical Document for OCR Extraction</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload prescriptions, lab reports, or discharge papers. Our Neural OCR engine scans document layout, extracts
            medications, physician details, disease risk indicators, and structures data for your review.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Document Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Document Type
          </label>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setDocumentType('PRESCRIPTION')}
              className={`py-2.5 px-4 rounded-lg border font-semibold text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${documentType === 'PRESCRIPTION'
                ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Prescription Order</span>
            </button>
            <button
              type="button"
              onClick={() => setDocumentType('REPORT')}
              className={`py-2.5 px-4 rounded-lg border font-semibold text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${documentType === 'REPORT'
                ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <FileCheck className="w-4 h-4 text-teal-700" />
              <span>Medical Lab Report</span>
            </button>
          </div>
        </div>

        {/* Processing State Display */}
        {isProcessing ? (
          <div className="p-10 bg-gradient-to-b from-teal-50/90 to-slate-50 rounded-xl border border-teal-200 flex flex-col items-center justify-center space-y-4 text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-teal-100/80 border border-teal-300 flex items-center justify-center text-teal-700 relative">
              <Loader2 className="w-7 h-7 animate-spin" />
              <Scan className="w-4 h-4 absolute text-teal-900 opacity-60" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-sm font-bold text-teal-950">
                {processingMessages[processingStage]}
              </h3>
              <p className="text-xs text-teal-700 font-mono">
                Neural OCR Processing • Step {processingStage + 1} of 3
              </p>
            </div>
            <div className="w-64 bg-teal-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-700 h-full transition-all duration-700 rounded-full"
                style={{ width: `${((processingStage + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          /* Visual Dropzone */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-8 text-center space-y-4 bg-slate-50/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-xs mx-auto flex items-center justify-center text-teal-700 border border-slate-200">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">
                Drag and drop your prescription or lab report image here
              </p>
              <p className="text-[11px] text-slate-500">
                Supports PNG, JPG, JPEG, WEBP up to 10 MB. Preserves document for audit trail.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="cursor-pointer px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs">
                <span>Select Document File</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".png,.jpg,.jpeg,.webp,.pdf"
                />
              </label>

              <span className="text-xs text-slate-400">or</span>

              {/* Demo Prescription Button */}
              <button
                type="button"
                id="btn-use-demo-prescription"
                onClick={triggerDemoUpload}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Use Sample Prescription (Dr. Steve Johnson)</span>
              </button>
            </div>
          </div>
        )}

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            OCR extraction reads text and predicts clinical risk factors for doctor review. Extracted records require patient confirmation before entry to active medication lists.
          </span>
        </div>
      </div>
    </div>
  );
};
