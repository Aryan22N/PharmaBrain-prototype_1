import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useHealthStore } from '../../lib/health-store';
import { Navbar } from './Navbar';
import { DemoDisclaimerFooter } from '../common/DemoDisclaimerFooter';
import {
  LayoutDashboard,
  Clock,
  TrendingUp,
  Pill,
  FileText,
  AlertCircle,
  FileSpreadsheet,
  Share2,
  Server,
  PlusCircle,
  RotateCcw,
  Home,
  Sliders,
  Menu,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  const { path, navigate } = useRouter();
  const {
    patientProfile,
    resetDemoData,
    toastMessage,
    clearToast,
    conflictRecordsCount,
  } = useHealthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/patient', icon: LayoutDashboard },
    { label: 'Medical Timeline', path: '/patient/timeline', icon: Clock, badge: conflictRecordsCount > 0 ? '1 conflict' : undefined },
    { label: 'Health Trends', path: '/patient/trends', icon: TrendingUp },
    { label: 'Medicines', path: '/patient/medicines', icon: Pill },
    { label: 'Documents', path: '/patient/documents', icon: FileText },
    { label: 'Symptoms & Side Effects', path: '/patient/symptoms', icon: AlertCircle },
    { label: 'Patient Summary', path: '/patient/summary', icon: FileSpreadsheet },
    { label: 'Share Records', path: '/patient/share', icon: Share2 },
    { label: 'HMS Integration', path: '/patient/hms', icon: Server },
  ];

  const handleNav = (targetPath: string) => {
    navigate(targetPath);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed top-16 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center justify-between gap-3 text-xs animate-slide-in"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <p className="leading-snug">{toastMessage}</p>
          </div>
          <button
            onClick={clearToast}
            className="text-slate-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
            RS
          </div>
          <span className="text-xs font-semibold text-slate-800">{patientProfile.name}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block fixed inset-0 z-40 bg-white pt-16 px-4' : 'hidden'
          } md:block md:static md:w-64 md:shrink-0 md:bg-white md:border-r md:border-slate-200 flex flex-col justify-between`}
        >
          {/* Top: Patient Card & Add Record CTA */}
          <div className="p-4 space-y-4">
            {/* Patient Badge */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                RS
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{patientProfile.name}</div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                  <span>{patientProfile.age}y • {patientProfile.gender}</span>
                  <span className="text-slate-300">•</span>
                  <span>{patientProfile.mrn}</span>
                </div>
              </div>
            </div>

            {/* Quick Action: Add Medical Info */}
            <button
              onClick={() => handleNav('/patient/add')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Medical Info</span>
            </button>

            {/* Navigation items */}
            <nav className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = path === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Quick App Controls */}
          <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/70">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              App Controls
            </div>

            {/* Reset Demo Data */}
            <button
              onClick={() => {
                resetDemoData();
                handleNav('/patient');
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo Data</span>
            </button>

            {/* Return to Home */}
            <button
              onClick={() => handleNav('/')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Return to Home</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>

      <DemoDisclaimerFooter />
    </div>
  );
};
