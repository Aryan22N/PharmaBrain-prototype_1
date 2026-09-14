import React from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { HealthProvider } from './lib/health-store';

// Layouts
import { PatientLayout } from './components/layout/PatientLayout';
import { DoctorLayout } from './components/layout/DoctorLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Patient Portal Pages
import { PatientOverviewPage } from './pages/patient/PatientOverviewPage';
import { PatientTimelinePage } from './pages/patient/PatientTimelinePage';
import { PatientAddHubPage } from './pages/patient/add/PatientAddHubPage';
import { HmsImportPage } from './pages/patient/add/HmsImportPage';
import { DocumentUploadPage } from './pages/patient/add/DocumentUploadPage';
import { ExtractedReviewPage } from './pages/patient/add/ExtractedReviewPage';
import { ManualEntryPage } from './pages/patient/add/ManualEntryPage';
import { PatientMedicinesPage } from './pages/patient/PatientMedicinesPage';
import { PatientDocumentsPage } from './pages/patient/PatientDocumentsPage';
import { PatientSymptomsPage } from './pages/patient/PatientSymptomsPage';
import { PatientTrendsPage } from './pages/patient/PatientTrendsPage';
import { PatientSummaryPage } from './pages/patient/PatientSummaryPage';
import { PatientSharePage } from './pages/patient/PatientSharePage';
import { PatientHmsPage } from './pages/patient/PatientHmsPage';

// Doctor Portal Pages
import { DoctorNavHubPage } from './pages/doctor/DoctorNavHubPage';
import { DoctorVerificationPage } from './pages/doctor/DoctorVerificationPage';
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage';
import { DoctorQueryAssistantPage } from './pages/doctor/DoctorQueryAssistantPage';

const AppContent: React.FC = () => {
  const { path } = useRouter();

  // Route matching logic
  const renderRoute = () => {
    switch (path) {
      // Public Routes
      case '/':
        return <LandingPage />;
      case '/onboarding':
        return <OnboardingPage />;

      // Patient Routes
      case '/patient':
        return (
          <PatientLayout>
            <PatientOverviewPage />
          </PatientLayout>
        );
      case '/patient/timeline':
        return (
          <PatientLayout>
            <PatientTimelinePage />
          </PatientLayout>
        );
      case '/patient/add':
        return (
          <PatientLayout>
            <PatientAddHubPage />
          </PatientLayout>
        );
      case '/patient/add/hms':
        return (
          <PatientLayout>
            <HmsImportPage />
          </PatientLayout>
        );
      case '/patient/add/upload':
        return (
          <PatientLayout>
            <DocumentUploadPage />
          </PatientLayout>
        );
      case '/patient/add/review':
        return (
          <PatientLayout>
            <ExtractedReviewPage />
          </PatientLayout>
        );
      case '/patient/add/manual':
        return (
          <PatientLayout>
            <ManualEntryPage />
          </PatientLayout>
        );
      case '/patient/medicines':
        return (
          <PatientLayout>
            <PatientMedicinesPage />
          </PatientLayout>
        );
      case '/patient/documents':
        return (
          <PatientLayout>
            <PatientDocumentsPage />
          </PatientLayout>
        );
      case '/patient/symptoms':
        return (
          <PatientLayout>
            <PatientSymptomsPage />
          </PatientLayout>
        );
      case '/patient/trends':
        return (
          <PatientLayout>
            <PatientTrendsPage />
          </PatientLayout>
        );
      case '/patient/summary':
        return (
          <PatientLayout>
            <PatientSummaryPage />
          </PatientLayout>
        );
      case '/patient/share':
        return (
          <PatientLayout>
            <PatientSharePage />
          </PatientLayout>
        );
      case '/patient/hms':
        return (
          <PatientLayout>
            <PatientHmsPage />
          </PatientLayout>
        );

      // Doctor Routes
      case '/doctor':
        return <DoctorNavHubPage />;
      case '/doctor/verify':
        return <DoctorVerificationPage />;
      case '/doctor/dashboard':
        return (
          <DoctorLayout>
            <DoctorDashboardPage />
          </DoctorLayout>
        );
      case '/doctor/dashboard/query':
        return (
          <DoctorLayout>
            <DoctorQueryAssistantPage />
          </DoctorLayout>
        );

      // Fallback
      default:
        if (path.startsWith('/patient')) {
          return (
            <PatientLayout>
              <PatientOverviewPage />
            </PatientLayout>
          );
        }
        if (path.startsWith('/doctor')) {
          return (
            <DoctorLayout>
              <DoctorDashboardPage />
            </DoctorLayout>
          );
        }
        return <LandingPage />;
    }
  };

  return renderRoute();
};

export default function App() {
  return (
    <RouterProvider>
      <HealthProvider>
        <AppContent />
      </HealthProvider>
    </RouterProvider>
  );
}
