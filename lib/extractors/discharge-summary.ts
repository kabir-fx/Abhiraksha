import type { DischargeSummaryData, ExtractionResult } from "./types";

/**
 * Multi-pattern field extractor.
 * Tries each regex pattern in order; returns the first match (capture group 1), trimmed.
 */
function matchField(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]?.trim()) {
      return match[1].trim();
    }
  }
  return "";
}

/**
 * Extract a section of text between a start label and the next known label.
 * Works on single-line merged text by searching for start/stop label patterns
 * as substrings rather than relying on newlines.
 */
function matchSection(
  text: string,
  startPatterns: RegExp[],
  stopPatterns: RegExp[],
): string {
  for (const startPattern of startPatterns) {
    const startMatch = startPattern.exec(text);
    if (!startMatch) continue;

    const startIndex = startMatch.index + startMatch[0].length;
    let endIndex = text.length;

    for (const stopPattern of stopPatterns) {
      const remaining = text.slice(startIndex);
      const stopMatch = stopPattern.exec(remaining);
      if (stopMatch && stopMatch.index < endIndex - startIndex) {
        endIndex = startIndex + stopMatch.index;
      }
    }

    const section = text.slice(startIndex, endIndex).trim();
    if (section.length > 0) {
      // Normalize whitespace
      return section.replace(/\s{2,}/g, " ").trim();
    }
  }
  return "";
}

// ── Common next-field labels used as terminators ──────────────────
// Instead of relying on \n, we use lookahead for common discharge summary
// field labels to know where a value ends and the next field begins.

const NEXT_FIELD =
  "(?=\\s+(?:Age|Gender|Sex|UHID|UH\\.?ID|MR\\.?\\s*No|MRN|IP\\s*No|IPD\\s*No|Date\\s*of|Admission\\s*Date|Discharge\\s*Date|DOA|DOD|Primary|Secondary|Diagnosis|Procedure|Surgery|Clinical|Treatment|Condition|Doctor|Consultant|Treating|Reg(?:istration)?|Medical\\s*Council|Advice|Follow|Investigation|Lab\\s*Result|Signature|Admitted|Discharged)\\b|$)";

// ── Regexes grouped by field ──────────────────────────────────────

const PATIENT_NAME_PATTERNS = [
  new RegExp(
    "(?:Patient\\s*Name|Name\\s*of\\s*(?:the\\s+)?Patient|Pt\\.?\\s*Name)\\s*[:\\-–]\\s*(.+?)" +
      NEXT_FIELD,
    "i",
  ),
];

const AGE_PATTERNS = [
  /(?:Age|Age\s*\/\s*Sex)\s*[:\-–]\s*(\d+\s*(?:years?|yrs?|Y)?)/i,
  /(\d+)\s*(?:years?|yrs?|Y)\s*(?:old)?/i,
];

const GENDER_PATTERNS = [
  /(?:Gender|Sex)\s*[:\-–]\s*(Male|Female|M|F|Other|Transgender)/i,
  /Age\s*\/\s*Sex\s*[:\-–]\s*\d+\s*(?:years?|yrs?|Y)?\s*\/?\s*(Male|Female|M|F)/i,
];

const UHID_PATTERNS = [
  /(?:UHID|UH\.?ID|MR\.?\s*No\.?|MRN|Medical\s*Record\s*No\.?|Hospital\s*(?:Reg\.?\s*)?(?:No\.?|Number)|IP\s*No\.?|IPD\s*No\.?|Registration\s*No\.?)\s*[:\-–]\s*([A-Za-z0-9\-\/]+)/i,
];

const ADMISSION_DATE_PATTERNS = [
  /(?:Date\s*of\s*Admission|Admission\s*Date|DOA|Admitted\s*(?:On|Date))\s*[:\-–]\s*(\d{1,2}[\-\/\.]\d{1,2}[\-\/\.]\d{2,4})/i,
  /(?:Date\s*of\s*Admission|Admission\s*Date|DOA|Admitted\s*(?:On|Date))\s*[:\-–]\s*(\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]*\d{2,4})/i,
];

const DISCHARGE_DATE_PATTERNS = [
  /(?:Date\s*of\s*Discharge|Discharge\s*Date|DOD|Discharged\s*(?:On|Date))\s*[:\-–]\s*(\d{1,2}[\-\/\.]\d{1,2}[\-\/\.]\d{2,4})/i,
  /(?:Date\s*of\s*Discharge|Discharge\s*Date|DOD|Discharged\s*(?:On|Date))\s*[:\-–]\s*(\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]*\d{2,4})/i,
];

const PRIMARY_DIAGNOSIS_PATTERNS = [
  /(?:Primary\s*Diagnosis|Principal\s*Diagnosis|Final\s*Diagnosis)\s*[:\-–]\s*(.+?)(?=\s+(?:Secondary|Other\s*Diagnosis|Co-?morbid|Procedure|Surgery|Treatment|Clinical|Condition|Doctor|Advice|Follow|Investigation)\b|$)/i,
  /(?:Diagnosis)\s*[:\-–]\s*(.+?)(?=\s+(?:Secondary|Procedure|Surgery|Treatment|Clinical|Condition|Doctor)\b|$)/i,
];

const SECONDARY_DIAGNOSIS_PATTERNS = [
  /(?:Secondary\s*Diagnosis|Other\s*Diagnosis|Co-?morbidities|Associated\s*Conditions)\s*[:\-–]\s*(.+?)(?=\s+(?:Procedure|Surgery|Operation|Treatment|Clinical|Condition|Doctor|Advice|Follow|Investigation)\b|$)/i,
];

const PROCEDURE_PATTERNS = [
  /(?:Procedure\s*(?:Performed|Done)?|Surgery\s*(?:Performed|Done)?|Operation\s*(?:Performed|Done)?|Operative\s*Procedure|Name\s*of\s*(?:the\s+)?(?:Procedure|Surgery))\s*[:\-–]\s*(.+?)(?=\s+(?:Clinical|Treatment|Condition|Doctor|Advice|Follow|Investigation|Diagnosis)\b|$)/i,
];

const DOCTOR_NAME_PATTERNS = [
  /(?:Treating\s*Doctor|Consultant|Attending\s*(?:Doctor|Physician)|Doctor(?:'s)?\s*Name|Name\s*of\s*(?:the\s+)?Doctor)\s*[:\-–]\s*(?:Dr\.?\s*)?(.+?)(?=\s+(?:Reg(?:istration)?|Medical\s*Council|License|MC[IR]|Signature|Date)\b|$)/i,
];

const DOCTOR_REG_PATTERNS = [
  /(?:(?:Doctor's?\s*)?Reg(?:istration)?\.?\s*(?:No\.?|Number)|Medical\s*Council\s*(?:Reg\.?\s*)?(?:No\.?|Number)|MC(?:I|R)\s*(?:No\.?|Number)|License\s*(?:No\.?|Number))\s*[:\-–]\s*([A-Za-z0-9\-\/]+)/i,
];

// ── Section markers for multi-line fields ─────────────────────────
const ALL_SECTION_HEADERS = [
  /(?:Clinical\s*Summary|History\s*of\s*(?:Present\s*)?Illness|Brief\s*History|Clinical\s*History)\b/i,
  /(?:Treatment\s*Given|Treatment\s*Details|Course\s*(?:in|of)\s*Hospital)\b/i,
  /(?:Condition\s*(?:at|on)\s*Discharge|Status\s*(?:at|on)\s*Discharge)\b/i,
  /(?:Advice\s*(?:on|at)\s*Discharge|Discharge\s*Advice)\b/i,
  /(?:Follow[\s-]*up|Review)\b/i,
  /(?:Primary\s*Diagnosis|Principal\s*Diagnosis|Final\s*Diagnosis|Diagnosis)\b/i,
  /(?:Secondary\s*Diagnosis|Other\s*Diagnosis|Co-?morbidities)\b/i,
  /(?:Procedure\s*(?:Performed|Done)?|Surgery\s*(?:Performed|Done)?|Operative\s*Procedure)\b/i,
  /(?:Investigation|Lab\s*Results)\b/i,
  /(?:Treating\s*Doctor|Consultant|Doctor(?:'s)?\s*Name|Signature)\b/i,
];

const CLINICAL_SUMMARY_START = [
  /(?:Clinical\s*Summary|History\s*of\s*(?:Present\s*)?Illness|Brief\s*History|Clinical\s*History|History)\s*[:\-–]?\s*/i,
];

const TREATMENT_START = [
  /(?:Treatment\s*Given|Treatment\s*Details|Course\s*(?:in|of)\s*Hospital|Treatment\s*(?:in|during)\s*Hospital|Treatment)\s*[:\-–]?\s*/i,
];

const CONDITION_AT_DISCHARGE_PATTERNS = [
  /(?:Condition\s*(?:at|on)\s*Discharge|Status\s*(?:at|on)\s*Discharge|General\s*Condition\s*(?:at|on)\s*Discharge)\s*[:\-–]\s*(.+?)(?=\s+(?:Advice|Follow|Doctor|Consultant|Treating|Signature|Reg(?:istration)?)\b|$)/i,
];

/**
 * Extracts structured discharge summary fields from raw PDF text.
 */
export function extractDischargeSummary(
  text: string,
): ExtractionResult<DischargeSummaryData> {
  const data: DischargeSummaryData = {
    patient_name: matchField(text, PATIENT_NAME_PATTERNS),
    age: matchField(text, AGE_PATTERNS),
    gender: matchField(text, GENDER_PATTERNS),
    uhid_number: matchField(text, UHID_PATTERNS),
    admission_date: matchField(text, ADMISSION_DATE_PATTERNS),
    discharge_date: matchField(text, DISCHARGE_DATE_PATTERNS),
    primary_diagnosis: matchField(text, PRIMARY_DIAGNOSIS_PATTERNS),
    secondary_diagnosis: matchField(text, SECONDARY_DIAGNOSIS_PATTERNS),
    procedure_performed: matchField(text, PROCEDURE_PATTERNS),
    clinical_summary: matchSection(
      text,
      CLINICAL_SUMMARY_START,
      ALL_SECTION_HEADERS.filter(
        (_, i) => i !== 0, // exclude self
      ),
    ),
    treatment_given: matchSection(
      text,
      TREATMENT_START,
      ALL_SECTION_HEADERS.filter(
        (_, i) => i !== 1, // exclude self
      ),
    ),
    condition_at_discharge: matchField(text, CONDITION_AT_DISCHARGE_PATTERNS),
    doctor_name: matchField(text, DOCTOR_NAME_PATTERNS),
    doctor_registration_number: matchField(text, DOCTOR_REG_PATTERNS),
  };

  // Build confidence map
  const confidence: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(data)) {
    confidence[key] = value.length > 0;
  }

  const foundCount = Object.values(confidence).filter(Boolean).length;

  return {
    success: foundCount >= 3,
    data,
    raw_text: text,
    confidence,
  };
}
