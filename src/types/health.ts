export enum SourceType {
  HOSPITAL_HMS = 'Hospital HMS',
  PATIENT_DOCUMENT = 'Patient Document',
  MANUAL_ENTRY = 'Manual Entry',
}

export enum ReliabilityLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum VerificationStatus {
  HOSPITAL_VERIFIED = 'Hospital Verified',
  DOCUMENT_SUPPORTED = 'Document Supported',
  PATIENT_CONFIRMED = 'Patient Confirmed',
  UNVERIFIED = 'Unverified',
  CONFLICTING = 'Conflicting',
}

export type RecordCategory = 
  | 'Medication' 
  | 'Lab Result' 
  | 'Clinical Encounter' 
  | 'Vital Measurement' 
  | 'Symptom Report' 
  | 'Cardiology'
  | 'Imaging';

export interface PatientProfile {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  abdmHealthId: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  icdCode?: string;
  diagnosedDate: string;
  diagnosedBy: string;
  status: 'Active' | 'Under Control' | 'Resolved';
  source: SourceType;
  reliability: ReliabilityLevel;
  verification: VerificationStatus;
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  indication: string;
  prescribedBy: string;
  facility: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  source: SourceType;
  reliability: ReliabilityLevel;
  verification: VerificationStatus;
  originalReference: string;
  isConflict?: boolean;
  conflictDescription?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: RecordCategory;
  date: string;
  facility: string;
  practitioner: string;
  summary: string;
  detailedFindings?: string;
  source: SourceType;
  reliability: ReliabilityLevel;
  verification: VerificationStatus;
  originalReference: string;
  documentFilename?: string;
  isConflict?: boolean;
  conflictNotes?: string;
  values?: Record<string, string | number>;
  tags?: string[];
}

export interface MeasurementPoint {
  date: string;
  value: number;
  secondaryValue?: number;
  unit: string;
  source: SourceType;
  referenceRange?: string;
  note?: string;
}

export interface MetricTrend {
  id: string;
  title: string;
  metric: 'fasting_glucose' | 'hba1c' | 'blood_pressure' | 'weight';
  unit: string;
  recordsCount: number;
  lastUpdated: string;
  analyticalMethod: string;
  clinicalInterpretation: string;
  targetRange: string;
  data: MeasurementPoint[];
}

export interface SymptomReport {
  id: string;
  symptom: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reportedDate: string;
  onsetDate: string;
  status: 'Active' | 'Resolving' | 'Resolved';
  relatedMedicationId?: string;
  relatedMedicationName?: string;
  temporalCorrelationText: string;
  patientNotes: string;
  source: SourceType;
  reliability: ReliabilityLevel;
  verification: VerificationStatus;
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Diagnostic Imaging';
  filename: string;
  fileSize: string;
  uploadDate: string;
  issuingFacility: string;
  doctorName?: string;
  source: SourceType;
  reliability: ReliabilityLevel;
  verification: VerificationStatus;
  extractionStatus: 'Extracted' | 'Pending' | 'Manual';
  simulatedPreviewText: string;
}

export interface SharingPermission {
  id: string;
  recipientName: string;
  recipientRole: string;
  recipientInstitution: string;
  grantedDate: string;
  expiryDate: string;
  durationLabel: string;
  sectionsAllowed: {
    basicProfile: boolean;
    conditions: boolean;
    medications: boolean;
    labTrends: boolean;
    hospitalRecords: boolean;
    symptoms: boolean;
    unverifiedDocuments: boolean;
  };
  status: 'Active' | 'Revoked' | 'Expired';
  accessToken: string;
}

export interface DoctorProfile {
  name: string;
  regNumber: string;
  specialty: string;
  hospital: string;
  council: string;
  isVerified: boolean;
  verifiedAt: string;
}
