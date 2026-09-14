import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  PatientProfile,
  MedicalCondition,
  Medication,
  MedicalRecord,
  MetricTrend,
  SymptomReport,
  MedicalDocument,
  SharingPermission,
  DoctorProfile,
  SourceType,
  ReliabilityLevel,
  VerificationStatus,
} from '../types/health';
import {
  initialPatientProfile,
  initialConditions,
  initialMedications,
  initialMedicalRecords,
  initialTrends,
  initialSymptoms,
  initialDocuments,
  initialSharingPermissions,
  initialDoctorProfile,
  availableHmsImportRecords,
} from '../data/initialData';

import { AnalysisResult } from './gemini-analysis';

const STORAGE_KEY = 'patient_centric_medical_record_state_v1';

interface HealthStoreState {
  patientProfile: PatientProfile;
  conditions: MedicalCondition[];
  medications: Medication[];
  medicalRecords: MedicalRecord[];
  trends: MetricTrend[];
  symptoms: SymptomReport[];
  documents: MedicalDocument[];
  sharingPermissions: SharingPermission[];
  doctorProfile: DoctorProfile;
  toastMessage: string | null;
  pendingUploadImage: string | null;
  pendingAnalysisResult: AnalysisResult | null;
}

interface HealthStoreContextType extends HealthStoreState {
  // Actions
  resetDemoData: () => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  setPendingUpload: (image: string | null, result: AnalysisResult | null) => void;
  importHmsRecord: (importId: string) => void;
  confirmExtractedData: (
    documentTitle: string,
    extractedMeds: Array<{ name: string; dosage: string; frequency: string; route: string; indication: string }>,
    doctorName: string,
    facility: string,
    reference: string
  ) => void;
  addManualEntry: (data: {
    title: string;
    category: any;
    summary: string;
    details?: string;
    symptomData?: {
      symptom: string;
      severity: 'Mild' | 'Moderate' | 'Severe';
      onsetDate: string;
      notes: string;
      relatedMedicationName?: string;
      temporalCorrelationText?: string;
    };
  }) => void;
  createSharingPermission: (data: {
    recipientName: string;
    recipientRole: string;
    durationLabel: string;
    sectionsAllowed: SharingPermission['sectionsAllowed'];
  }) => void;
  revokeSharingPermission: (id: string) => void;
  completeDoctorVerification: () => void;

  // Derived statistics
  totalRecordsCount: number;
  hospitalVerifiedCount: number;
  documentSupportedCount: number;
  patientReportedCount: number;
  conflictRecordsCount: number;
  activeMedicationsCount: number;
  latestHba1c: string;
  latestFastingGlucose: string;
  latestBp: string;
  coverageBreakdown: {
    basicInfo: { label: string; status: 'Complete'; pct: number };
    knownConditions: { label: string; status: 'Available'; pct: number };
    medicationHistory: { label: string; status: 'Partial'; pct: number };
    pastMedicalEvents: { label: string; status: 'Limited'; pct: number };
    supportingDocuments: { label: string; status: 'Partial'; pct: number };
  };
  sourceBreakdown: {
    hospitalHms: number;
    patientDocument: number;
    manualEntry: number;
  };
}

const HealthContext = createContext<HealthStoreContextType | null>(null);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HealthStoreState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fall back to initial
    }
    return {
      patientProfile: initialPatientProfile,
      conditions: initialConditions,
      medications: initialMedications,
      medicalRecords: initialMedicalRecords,
      trends: initialTrends,
      symptoms: initialSymptoms,
      documents: initialDocuments,
      sharingPermissions: initialSharingPermissions,
      doctorProfile: initialDoctorProfile,
      toastMessage: null,
      pendingUploadImage: null,
      pendingAnalysisResult: null,
    };
  });

  const setPendingUpload = (image: string | null, result: AnalysisResult | null) => {
    setState((prev) => ({
      ...prev,
      pendingUploadImage: image,
      pendingAnalysisResult: result,
    }));
  };

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save demo state', e);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setState((prev) => ({ ...prev, toastMessage: msg }));
    setTimeout(() => {
      setState((prev) => (prev.toastMessage === msg ? { ...prev, toastMessage: null } : prev));
    }, 4500);
  };

  const clearToast = () => {
    setState((prev) => ({ ...prev, toastMessage: null }));
  };

  const resetDemoData = () => {
    const fresh: HealthStoreState = {
      patientProfile: initialPatientProfile,
      conditions: initialConditions,
      medications: initialMedications,
      medicalRecords: initialMedicalRecords,
      trends: initialTrends,
      symptoms: initialSymptoms,
      documents: initialDocuments,
      sharingPermissions: initialSharingPermissions,
      doctorProfile: initialDoctorProfile,
      toastMessage: 'Demo data reset to initial state.',
      pendingUploadImage: null,
      pendingAnalysisResult: null,
    };
    setState(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore
    }
  };

  const importHmsRecord = (importId: string) => {
    const recordMeta = availableHmsImportRecords.find((r) => r.id === importId) || availableHmsImportRecords[0];
    
    // Check if already imported
    const exists = state.medicalRecords.some((r) => r.originalReference === recordMeta.reference);
    if (exists) {
      showToast(`Record ${recordMeta.reference} is already present in your clinical timeline.`);
      return;
    }

    const newRec: MedicalRecord = {
      id: `rec-hms-imported-${Date.now()}`,
      title: recordMeta.title,
      category: recordMeta.category as any,
      date: '2026-09-10',
      facility: 'Demo General Hospital',
      practitioner: recordMeta.doctor,
      summary: recordMeta.details,
      detailedFindings: 'Direct hospital FHIR import. Authenticated by hospital digital PKI certificate.',
      source: SourceType.HOSPITAL_HMS,
      reliability: ReliabilityLevel.HIGH,
      verification: VerificationStatus.HOSPITAL_VERIFIED,
      originalReference: recordMeta.reference,
      tags: ['Hospital Import', 'FHIR R4', 'ABDM Verified'],
    };

    setState((prev) => ({
      ...prev,
      medicalRecords: [newRec, ...prev.medicalRecords],
    }));

    showToast(`Successfully imported record from Demo General Hospital (${recordMeta.reference}).`);
  };

  const confirmExtractedData = (
    documentTitle: string,
    extractedMeds: Array<{ name: string; dosage: string; frequency: string; route: string; indication: string }>,
    doctorName: string,
    facility: string,
    reference: string
  ) => {
    const newDocId = `doc-upload-${Date.now()}`;
    const newDoc: MedicalDocument = {
      id: newDocId,
      title: documentTitle,
      type: 'Prescription',
      filename: `${documentTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: '512 KB',
      uploadDate: '2026-09-13',
      issuingFacility: facility,
      doctorName,
      source: SourceType.PATIENT_DOCUMENT,
      reliability: ReliabilityLevel.MEDIUM,
      verification: VerificationStatus.PATIENT_CONFIRMED,
      extractionStatus: 'Extracted',
      simulatedPreviewText: `DOCUMENT PREVIEW: ${documentTitle}\nFacility: ${facility}\nPhysician: ${doctorName}\nRef: ${reference}\nPrescribed: ${extractedMeds.map((m) => `${m.name} ${m.dosage} (${m.frequency})`).join(', ')}\nStatus: Patient Confirmed`,
    };

    const newRecord: MedicalRecord = {
      id: `rec-upload-${Date.now()}`,
      title: `Patient-Uploaded Prescription: ${documentTitle}`,
      category: 'Medication',
      date: '2026-09-13',
      facility,
      practitioner: doctorName,
      summary: `Uploaded prescription document verified and confirmed by patient. Added ${extractedMeds.length} medication items.`,
      detailedFindings: `AI OCR extraction reviewed and confirmed by patient. Original reference: ${reference}`,
      source: SourceType.PATIENT_DOCUMENT,
      reliability: ReliabilityLevel.MEDIUM,
      verification: VerificationStatus.PATIENT_CONFIRMED,
      originalReference: reference,
      documentFilename: newDoc.filename,
      tags: ['Patient Upload', 'OCR Extracted', 'Patient Confirmed'],
    };

    const newMeds: Medication[] = extractedMeds.map((m, idx) => ({
      id: `med-extracted-${Date.now()}-${idx}`,
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      route: m.route || 'Oral',
      indication: m.indication || 'Maintenance Therapy',
      prescribedBy: doctorName,
      facility,
      startDate: '2026-09-13',
      isActive: true,
      source: SourceType.PATIENT_DOCUMENT,
      reliability: ReliabilityLevel.MEDIUM,
      verification: VerificationStatus.PATIENT_CONFIRMED,
      originalReference: reference,
    }));

    setState((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
      medicalRecords: [newRecord, ...prev.medicalRecords],
      medications: [...newMeds, ...prev.medications],
    }));

    showToast('Document confirmed! Added to timeline, documents, and active medications with Patient Confirmed status.');
  };

  const addManualEntry = (data: {
    title: string;
    category: any;
    summary: string;
    details?: string;
    symptomData?: {
      symptom: string;
      severity: 'Mild' | 'Moderate' | 'Severe';
      onsetDate: string;
      notes: string;
      relatedMedicationName?: string;
      temporalCorrelationText?: string;
    };
  }) => {
    const timestamp = Date.now();
    const reference = `PATIENT-MANUAL-2026-0913-${timestamp.toString().slice(-4)}`;

    const newRecord: MedicalRecord = {
      id: `rec-manual-${timestamp}`,
      title: data.title,
      category: data.category,
      date: '2026-09-13',
      facility: 'Patient Home Portal',
      practitioner: 'Rahul Sharma (Patient Self-Report)',
      summary: data.summary,
      detailedFindings: data.details || 'Patient manual entry logged in personal medical record.',
      source: SourceType.MANUAL_ENTRY,
      reliability: ReliabilityLevel.LOW,
      verification: VerificationStatus.PATIENT_CONFIRMED,
      originalReference: reference,
      tags: ['Patient Entry', 'Manual Entry'],
    };

    let newSymptom: SymptomReport | undefined;
    if (data.symptomData) {
      newSymptom = {
        id: `symp-${timestamp}`,
        symptom: data.symptomData.symptom,
        severity: data.symptomData.severity,
        reportedDate: '2026-09-13',
        onsetDate: data.symptomData.onsetDate,
        status: 'Active',
        relatedMedicationName: data.symptomData.relatedMedicationName,
        temporalCorrelationText:
          data.symptomData.temporalCorrelationText ||
          `Temporal note: Symptom logged on 13 Sep 2026 following medication adjustment. Patient recommends doctor review.`,
        patientNotes: data.symptomData.notes,
        source: SourceType.MANUAL_ENTRY,
        reliability: ReliabilityLevel.LOW,
        verification: VerificationStatus.PATIENT_CONFIRMED,
      };
    }

    setState((prev) => ({
      ...prev,
      medicalRecords: [newRecord, ...prev.medicalRecords],
      symptoms: newSymptom ? [newSymptom, ...prev.symptoms] : prev.symptoms,
    }));

    showToast('Manual entry saved to your Medical Timeline and Symptoms tracker.');
  };

  const createSharingPermission = (data: {
    recipientName: string;
    recipientRole: string;
    durationLabel: string;
    sectionsAllowed: SharingPermission['sectionsAllowed'];
  }) => {
    const newShare: SharingPermission = {
      id: `share-${Date.now()}`,
      recipientName: data.recipientName,
      recipientRole: data.recipientRole,
      recipientInstitution: 'Demo General Hospital',
      grantedDate: '2026-09-13',
      expiryDate: '2026-10-13',
      durationLabel: data.durationLabel,
      sectionsAllowed: data.sectionsAllowed,
      status: 'Active',
      accessToken: `DEMO-SECURE-TOKEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };

    setState((prev) => ({
      ...prev,
      sharingPermissions: [newShare, ...prev.sharingPermissions],
    }));

    showToast(`Secure demo access generated for ${data.recipientName} (${data.durationLabel}).`);
  };

  const revokeSharingPermission = (id: string) => {
    setState((prev) => ({
      ...prev,
      sharingPermissions: prev.sharingPermissions.map((s) =>
        s.id === id ? { ...s, status: 'Revoked' } : s
      ),
    }));
    showToast('Access permission immediately revoked.');
  };

  const completeDoctorVerification = () => {
    setState((prev) => ({
      ...prev,
      doctorProfile: {
        ...prev.doctorProfile,
        isVerified: true,
        verifiedAt: '2026-09-13',
      },
    }));
    showToast('Doctor credentials authenticated via State Medical Council registry.');
  };

  // Derived computations
  const totalRecordsCount = state.medicalRecords.length;

  const hospitalVerifiedCount = useMemo(
    () => state.medicalRecords.filter((r) => r.verification === VerificationStatus.HOSPITAL_VERIFIED).length,
    [state.medicalRecords]
  );

  const documentSupportedCount = useMemo(
    () => state.medicalRecords.filter((r) => r.verification === VerificationStatus.DOCUMENT_SUPPORTED).length,
    [state.medicalRecords]
  );

  const patientReportedCount = useMemo(
    () =>
      state.medicalRecords.filter(
        (r) =>
          r.verification === VerificationStatus.PATIENT_CONFIRMED ||
          r.verification === VerificationStatus.UNVERIFIED ||
          r.source === SourceType.MANUAL_ENTRY
      ).length,
    [state.medicalRecords]
  );

  const conflictRecordsCount = useMemo(
    () => state.medicalRecords.filter((r) => r.isConflict || r.verification === VerificationStatus.CONFLICTING).length,
    [state.medicalRecords]
  );

  const activeMedicationsCount = useMemo(
    () => state.medications.filter((m) => m.isActive).length,
    [state.medications]
  );

  const sourceBreakdown = useMemo(() => {
    const counts = { hospitalHms: 0, patientDocument: 0, manualEntry: 0 };
    for (const r of state.medicalRecords) {
      if (r.source === SourceType.HOSPITAL_HMS) counts.hospitalHms++;
      else if (r.source === SourceType.PATIENT_DOCUMENT) counts.patientDocument++;
      else counts.manualEntry++;
    }
    return counts;
  }, [state.medicalRecords]);

  const latestHba1c = '8.1%';
  const latestFastingGlucose = '168 mg/dL';
  const latestBp = '146/92 mmHg';

  const coverageBreakdown = {
    basicInfo: { label: 'Basic Information', status: 'Complete' as const, pct: 100 },
    knownConditions: { label: 'Known Conditions', status: 'Available' as const, pct: 85 },
    medicationHistory: { label: 'Medication History', status: 'Partial' as const, pct: 60 },
    pastMedicalEvents: { label: 'Past Medical Events', status: 'Limited' as const, pct: 40 },
    supportingDocuments: { label: 'Supporting Documents', status: 'Partial' as const, pct: 65 },
  };

  return (
    <HealthContext.Provider
      value={{
        ...state,
        resetDemoData,
        showToast,
        clearToast,
        setPendingUpload,
        importHmsRecord,
        confirmExtractedData,
        addManualEntry,
        createSharingPermission,
        revokeSharingPermission,
        completeDoctorVerification,
        totalRecordsCount,
        hospitalVerifiedCount,
        documentSupportedCount,
        patientReportedCount,
        conflictRecordsCount,
        activeMedicationsCount,
        latestHba1c,
        latestFastingGlucose,
        latestBp,
        coverageBreakdown,
        sourceBreakdown,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealthStore = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealthStore must be used within a HealthProvider');
  }
  return context;
};
