import type { DischargeSummaryData, ExtractionResult } from "./types";
import { getGenerativeModel } from "../ai";

const MODEL_NAME = "gemini-2.5-flash";

const SYSTEM_PROMPT = `
You are an expert medical document parser. Your goal is to extract structured data from a discharge summary PDF text.
Return the result in strictly valid JSON format matching the following structure. Do not finclude markdown code blocks or any other text.

{
  "patient_name": "string",
  "age": "string",
  "gender": "string",
  "uhid_number": "string",
  "admission_date": "string (DD-MM-YYYY or DD/MM/YYYY)",
  "discharge_date": "string (DD-MM-YYYY or DD/MM/YYYY)",
  "primary_diagnosis": "string",
  "secondary_diagnosis": "string",
  "procedure_performed": "string",
  "clinical_summary": "string",
  "treatment_given": "string",
  "condition_at_discharge": "string",
  "doctor_name": "string",
  "doctor_registration_number": "string"
}

If a field is not found or ambiguous, leave it as an empty string "".
Clean up the text: remove excess whitespace, newlines, and artifacts.
Format dates consistently as DD-MM-YYYY if possible.
`;

export async function extractDischargeSummaryAI(
  text: string,
): Promise<ExtractionResult<DischargeSummaryData>> {
  try {
    const model = getGenerativeModel(MODEL_NAME);

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      `Here is the discharge summary text:\n\n${text}`,
    ]);

    const response = result.response;
    const responseText = response.text();

    // Clean up markdown code blocks if present (just in case)
    const jsonString = responseText
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "");

    const data = JSON.parse(jsonString) as DischargeSummaryData;

    // Build confidence map based on non-empty values
    const confidence: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(data)) {
      confidence[key] = typeof value === "string" && value.trim().length > 0;
    }

    // Ensure all required fields exist (defaults)
    const defaults: DischargeSummaryData = {
      patient_name: "",
      age: "",
      gender: "",
      uhid_number: "",
      admission_date: "",
      discharge_date: "",
      primary_diagnosis: "",
      secondary_diagnosis: "",
      procedure_performed: "",
      clinical_summary: "",
      treatment_given: "",
      condition_at_discharge: "",
      doctor_name: "",
      doctor_registration_number: "",
    };
    const finalData = { ...defaults, ...data };

    const foundCount = Object.values(confidence).filter(Boolean).length;

    return {
      success: foundCount >= 3,
      data: finalData,
      raw_text: text,
      confidence,
    };
  } catch (error) {
    console.error("AI Extraction Logic Error:", error);
    // Fallback or error return - for now we return "failed" but with empty data
    // Ideally we might want to fallback to regex, but user explicitly asked for AI
    return {
      success: false,
      data: {
        patient_name: "",
        age: "",
        gender: "",
        uhid_number: "",
        admission_date: "",
        discharge_date: "",
        primary_diagnosis: "",
        secondary_diagnosis: "",
        procedure_performed: "",
        clinical_summary: "",
        treatment_given: "",
        condition_at_discharge: "",
        doctor_name: "",
        doctor_registration_number: "",
      },
      raw_text: text,
      confidence: {},
      error: "AI extraction failed. Please check API key and quota.",
    };
  }
}
