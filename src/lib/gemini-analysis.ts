import { GoogleGenAI } from '@google/genai';

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface AnalysisResult {
  documentType: 'PRESCRIPTION' | 'REPORT';
  summary: string;
  doctorName?: string;
  facility?: string;
  medicines: ExtractedMedicine[];
  keyFindings: string[];
  potentialDiseases: string[];
  precautions: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export const fallbackMockResult: AnalysisResult = {
  documentType: 'PRESCRIPTION',
  summary: 'Prescribing Physician: Dr. Steve Johnson (Medical Centre, 824 14th St, NY). 4 active medications prescribed with specific daily timing (BID, TID, QD).',
  doctorName: 'Dr. Steve Johnson',
  facility: 'Medical Centre, 824 14th St, NY',
  medicines: [
    { name: 'Betaloc 50mg', dosage: '50 mg', duration: '30 days', instructions: '1 tab daily (QD) after morning meal' },
    { name: 'Oxprelol 20mg', dosage: '20 mg', duration: '30 days', instructions: '1 tab twice daily (BID)' },
    { name: 'Dorzolamidum 2%', dosage: '2% Drops', duration: '60 days', instructions: '1 drop in affected eye twice daily (BID)' },
    { name: 'Cimetidine 400mg', dosage: '400 mg', duration: '14 days', instructions: '1 tab three times daily (TID) before meals' }
  ],
  keyFindings: [
    'Prescribing Physician: Dr. Steve Johnson (Medical Centre, 824 14th St, NY)',
    '4 active medications prescribed with specific daily timing (BID, TID, QD).'
  ],
  potentialDiseases: [
    'Hypertension / Cardiovascular management (indicated by Betaloc & Oxprelol beta-blockers)',
    'Glaucoma or Ocular Hypertension (indicated by Dorzolamidum ophthalmic/systemic agent)',
    'Gastric Ulcer / Acid Reflux / GERD (indicated by Cimetidine H2-receptor antagonist)'
  ],
  precautions: [
    'Take medications strictly according to the schedule prescribed by Dr. Steve Johnson.',
    'Do not alter doses without consulting a qualified clinician or pharmacist.'
  ],
  questionsForDoctor: [
    'Are there any potential interactions between Betaloc and Oxprelol?',
    'How often should intraocular pressure and blood pressure be monitored while on this regimen?'
  ],
  disclaimer: 'Informational prototype output only. It may contain errors and must be verified with a qualified healthcare professional. It is not a diagnosis or treatment recommendation.'
};

const apiKey =
  (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  (import.meta as any).env?.GEMINI_API_KEY ||
  '';

const configuredModel =
  (import.meta as any).env?.VITE_GEMINI_MODEL ||
  (import.meta as any).env?.GEMINI_MODEL ||
  'gemini-3.6-flash';

export async function analyseFile(
  base64Data: string,
  mimeType: string = 'image/jpeg',
  type: 'PRESCRIPTION' | 'REPORT' = 'PRESCRIPTION'
): Promise<{ result: AnalysisResult; isDemo: boolean }> {
  // Strip data URL header if present (e.g. data:image/png;base64,...)
  const pureBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

  const defaultChain = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
  const modelsToTry = Array.from(new Set([configuredModel, ...defaultChain])).filter(Boolean);

  const systemInstruction = `You are an expert AI medical assistant for an academic document analysis prototype called PharmaBrain.
Make sure to carefully read the hospital/clinic/facility name in the image provided.
If the hospital name is found, extract it into the 'facility' field AND show that with the hospital name in the summary (e.g. 'Prescribing Physician: Dr. Name (Hospital Name, Address)').`;

  const prompt = `Analyze the attached ${type === 'PRESCRIPTION' ? 'prescription' : 'medical lab report'} document or image.
Perform two main tasks:
1. SUMMARIZE: Extract summary, prescribing doctor name (doctorName), hospital/clinic/facility name (facility), prescribed medicines (with name, dosage, duration, instructions), key findings, precautions, and questions for doctor. Make sure to read the hospital name in the image provided; if the hospital name is found, populate the 'facility' field with the hospital name and include the hospital name in the summary.
2. DISEASE PREDICTION & RISK ASSESSMENT: Based on the medicines listed or lab report findings/abnormalities, evaluate and predict potential health conditions, diseases, or clinical risk factors the patient might have or be at risk for.

Important Guidelines:
- Make sure to read the hospital/clinic/facility name at the top or anywhere on the document image. If the hospital name is found, include it clearly in the 'facility' field and in the summary.
- Only analyze clearly visible information in the document.
- If the document is not a medical document or text is unreadable, state clearly in summary that no medical information was found and return empty arrays for medicines and potentialDiseases.
- Keep disease predictions cautious, educational, and framed as potential conditions to discuss with a physician.

Return JSON strictly matching this schema:
{
  "documentType": "${type}",
  "summary": "string",
  "doctorName": "string (or empty if unreadable/not present)",
  "facility": "string (exact hospital or clinic name found in image, or empty if unreadable/not present)",
  "medicines": [{"name": "string", "dosage": "string", "duration": "string", "instructions": "string"}],
  "keyFindings": ["string"],
  "potentialDiseases": ["string (predicted potential diseases or health conditions)"],
  "precautions": ["string"],
  "questionsForDoctor": ["string"],
  "disclaimer": "Informational prototype output only. It may contain errors and must be verified with a qualified healthcare professional. It is not a diagnosis or treatment recommendation."
}`;

  if (apiKey) {
    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      try {
        console.log(`[PharmaBrain OCR AI] Attempting document analysis using model [${i + 1}/${modelsToTry.length}]: ${model}`);
        
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                { inlineData: { mimeType, data: pureBase64 } }
              ]
            }
          ],
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText) as Partial<AnalysisResult>;
          const result: AnalysisResult = {
            documentType: type,
            summary: parsed.summary || 'Not clearly readable from the uploaded document.',
            doctorName: parsed.doctorName || undefined,
            facility: parsed.facility || undefined,
            medicines: Array.isArray(parsed.medicines) ? parsed.medicines : [],
            keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings : [],
            potentialDiseases: Array.isArray(parsed.potentialDiseases) ? parsed.potentialDiseases : [],
            precautions: Array.isArray(parsed.precautions) ? parsed.precautions : [],
            questionsForDoctor: Array.isArray(parsed.questionsForDoctor) ? parsed.questionsForDoctor : [],
            disclaimer: parsed.disclaimer || fallbackMockResult.disclaimer,
          };
          console.log(`[PharmaBrain OCR AI] Successfully completed document analysis with model: ${model}`);
          return { result, isDemo: false };
        }
      } catch (err: any) {
        console.warn(`[PharmaBrain OCR AI Warning] Model ${model} encountered an issue (${err?.message || err}). Trying next model...`);
      }
    }
  }

  console.warn('[PharmaBrain OCR AI] Fallback demo mode output activated.');
  return { result: fallbackMockResult, isDemo: true };
}
