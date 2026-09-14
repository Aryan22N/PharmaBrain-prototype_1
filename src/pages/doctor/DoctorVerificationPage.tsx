import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useHealthStore } from '../../lib/health-store';
import { Navbar } from '../../components/layout/Navbar';
import { DemoDisclaimerFooter } from '../../components/common/DemoDisclaimerFooter';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const DoctorVerificationPage: React.FC = () => {
  const { navigate } = useRouter();
  const { showToast } = useHealthStore();

  const [patientId, setPatientId] = useState('MRN-2024-8841');
  const [tokenPin, setTokenPin] = useState('7482');
  const [doctorReg, setDoctorReg] = useState('MCI-2012-7721');
  const [reason, setReason] = useState('Routine Outpatient Endocrinology Follow-up & Glycemic Review');
  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentConfirmed) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast('Digital consent verified for Rahul Sharma (MRN-2024-8841). Opening clinical record.');
      navigate('/doctor/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 space-y-6">
        <button
          onClick={() => navigate('/doctor')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clinician Hub</span>
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
                ABDM Provider Authentication
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Doctor Session
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              Doctor Consent & Access Verification
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authenticate digital token and verify patient consent before accessing longitudinal PHR records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patient Identifier (MRN / ABHA ID)</label>
              <input
                type="text"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-mono text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Consent OTP / PIN</label>
                <input
                  type="text"
                  required
                  value={tokenPin}
                  onChange={(e) => setTokenPin(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-mono text-teal-900 font-bold tracking-widest text-center"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Registration No.</label>
                <input
                  type="text"
                  required
                  value={doctorReg}
                  onChange={(e) => setDoctorReg(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Purpose for Access</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800"
              />
            </div>

            {/* Consent Verification Checkbox explicitly required */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5 shrink-0"
                />
                <span className="text-slate-700 leading-snug">
                  I certify that patient consent has been verified in accordance with ABDM guidelines, and this access is
                  strictly for clinical diagnosis and direct patient care.
                </span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                type="submit"
                id="btn-verify-doctor-access"
                disabled={isVerifying || !consentConfirmed}
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isVerifying ? (
                  <span>Verifying Cryptographic Consent...</span>
                ) : (
                  <>
                    <span>Verify & Access Patient Clinical Record</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <DemoDisclaimerFooter />
    </div>
  );
};
