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
  Sparkles,
  ShieldCheck,
  Building,
  ArrowLeft,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  const { path, navigate } = useRouter();
  const { doctorProfile, toastMessage, clearToast, conflictRecordsCount } = useHealthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Patient Clinical Overview', path: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Clinical Timeline', path: '/doctor/dashboard#timeline', icon: Clock, badge: conflictRecordsCount > 0 ? '1 conflict' : undefined },
    { label: 'Diagnostic Trends', path: '/doctor/dashboard#trends', icon: TrendingUp },
    { label: 'Current Medicines', path: '/doctor/dashboard#medicines', icon: Pill },
    { label: 'Original Documents', path: '/doctor/dashboard#documents', icon: FileText },
    { label: 'AI Record Query', path: '/doctor/dashboard/query', icon: Sparkles, badge: 'Demo' },
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
          id="doctor-toast-notification"
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

      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
            PD
          </div>
          <span className="text-xs font-semibold text-slate-800">{doctorProfile.name}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Doctor Left Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block fixed inset-0 z-40 bg-white pt-16 px-4' : 'hidden'
          } md:block md:static md:w-64 md:shrink-0 md:bg-white md:border-r md:border-slate-200 flex flex-col justify-between`}
        >
          <div className="p-4 space-y-4">
            {/* Doctor Profile Card */}
            <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                  PD
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-indigo-950 truncate">{doctorProfile.name}</div>
                  <div className="text-[11px] text-indigo-700 font-medium truncate">{doctorProfile.specialty}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-200/80 flex items-center justify-between text-[11px]">
                <span className="font-mono text-indigo-900">{doctorProfile.regNumber}</span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Active Patient Target info */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Patient Record
              </div>
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Rahul Sharma</span>
                <span className="font-mono text-[11px] text-slate-500">DEMO-P001</span>
              </div>
              <div className="text-[11px] text-slate-500">Age 42 • Male • Blood Group B+</div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = path === item.path || (item.path.includes('#') && path === '/doctor/dashboard');
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      path === item.path
                        ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${path === item.path ? 'text-indigo-700' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded font-bold border border-indigo-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom actions */}
          <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/70">
            <button
              onClick={() => handleNav('/doctor')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Doctor Portal Hub</span>
            </button>
            <button
              onClick={() => handleNav('/patient')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Switch to Patient View</span>
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
