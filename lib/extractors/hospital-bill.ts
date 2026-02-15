import type { HospitalBillData, ExtractionResult } from "./types";

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
 * Extract an amount value near a label.
 * Looks for the label, then captures the first monetary number that follows.
 */
function matchAmount(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Return the last captured group that has a value (the amount)
      for (let i = match.length - 1; i >= 1; i--) {
        if (match[i]?.trim()) {
          return match[i].trim();
        }
      }
    }
  }
  return "";
}

// ── Bill metadata patterns ────────────────────────────────────────

const BILL_NUMBER_PATTERNS = [
  /(?:Bill\s*(?:No\.?|Number)|Invoice\s*(?:No\.?|Number)|Receipt\s*(?:No\.?|Number))\s*[:\-–]?\s*([A-Za-z0-9\-\/]+)/i,
  /\b(IP[\-\s]?\d{4}[\-\s]?\d{3,})\b/i,
];

const BILL_DATE_PATTERNS = [
  /(?:Bill\s*Date|Invoice\s*Date|Date\s*of\s*Bill)\s*[:\-–]?\s*(\d{1,2}[\-\/\.]\d{1,2}[\-\/\.]\d{2,4})/i,
  /(?:Bill\s*Date|Invoice\s*Date)\s*[:\-–]?\s*(\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]*\d{2,4})/i,
];

const PATIENT_NAME_PATTERNS = [
  /(?:Patient\s*Name|Name\s*of\s*(?:the\s+)?Patient|Pt\.?\s*Name)\s*[:\-–]?\s*(.+?)(?:\s+(?:Bill|Admit|Age|Gender|UHID|IP\s*No))/i,
];

// ── Charge patterns ───────────────────────────────────────────────
// KEY DESIGN: Do NOT anchor to $ (end-of-line). unpdf mergePages produces
// a single long line, so $ would mean end-of-text and every lazy .*? would
// overshoot to the last number (NET PAYABLE). Instead, we capture the FIRST
// monetary amount (digits with commas + ".XX") appearing after each label.

const REGISTRATION_PATTERNS = [
  /Registration\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

const ROOM_RENT_RATE_PATTERNS = [
  /Room\s*Rent.*?Rate[:\s]*?(\d[\d,]*\.\d{2})/i,
  /Room\s*Rent.*?(\d[\d,]*\.\d{2})\s*(?:x|×)/i,
];

const ROOM_RENT_DAYS_PATTERNS = [
  /Room\s*Rent.*?(?:x|×)\s*(\d+)\s*Days?/i,
  /Room\s*Rent.*?(\d+)\s*Days?/i,
];

const ROOM_RENT_TOTAL_PATTERNS = [
  // The total is the SECOND monetary amount on the Room Rent line
  // (first is the rate, second is the total)
  /Room\s*Rent.*?\d[\d,]*\.\d{2}.*?(\d[\d,]*\.\d{2})/i,
];

const ICU_PATTERNS = [/ICU\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i];

const NURSING_PATTERNS = [/Nursing\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i];

const DOCTOR_VISIT_PATTERNS = [
  /Doctor\s*(?:Visit\s*)?Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /Consultation\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

const SURGERY_PATTERNS = [
  /Surgery\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /Surgical\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

const ANESTHESIA_PATTERNS = [
  /Anesth?esia\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /Anaesth?esia\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

const OT_PATTERNS = [
  /Operation\s*Theat(?:re|er)\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /O\.?\s*T\.?\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

const PHARMACY_PATTERNS = [
  /Pharmacy\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /Medicine\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

const INVESTIGATION_PATTERNS = [
  /Investigation\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /Lab(?:oratory)?\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /Pathology\s*(?:&|and)?\s*Imaging\s+.*?(\d[\d,]*\.\d{2})/i,
];

const CONSUMABLES_PATTERNS = [
  /Consumables?\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

const EQUIPMENT_PATTERNS = [/Equipment\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i];

const MISCELLANEOUS_PATTERNS = [
  /Miscellaneous\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
  /Misc\.?\s*Charges?\s+.*?(\d[\d,]*\.\d{2})/i,
];

// ── Totals ────────────────────────────────────────────────────────

const GROSS_TOTAL_PATTERNS = [
  /GROSS\s*TOTAL\s*[:\-–]?\s*(?:Rs\.?\s*|INR\s*|₹\s*)?(\d[\d,]*\.\d{2})/i,
  /(?:Grand\s*Total|Total\s*Amount|Sub\s*Total)\s*[:\-–]?\s*(?:Rs\.?\s*|INR\s*|₹\s*)?(\d[\d,]*\.\d{2})/i,
];

const DISCOUNT_PATTERNS = [
  /DISCOUNT\s*[:\-–]?\s*[-–]?\s*(?:Rs\.?\s*|INR\s*|₹\s*)?(\d[\d,]*\.\d{2})/i,
  /(?:Less|Concession|Rebate)\s*[:\-–]?\s*(?:Rs\.?\s*|INR\s*|₹\s*)?(\d[\d,]*\.\d{2})/i,
];

const NET_PAYABLE_PATTERNS = [
  /NET\s*PAYABLE\s*[:\-–]?\s*(?:Rs\.?\s*|INR\s*|₹\s*)?(\d[\d,]*\.\d{2})/i,
  /(?:Net\s*(?:Amount|Bill)|Amount\s*Payable|Final\s*Amount|(?:Total\s*)?Payable)\s*[:\-–]?\s*(?:Rs\.?\s*|INR\s*|₹\s*)?(\d[\d,]*\.\d{2})/i,
];

/**
 * Extracts structured hospital bill fields from raw PDF text.
 */
export function extractHospitalBill(
  text: string,
): ExtractionResult<HospitalBillData> {
  const data: HospitalBillData = {
    bill_number: matchField(text, BILL_NUMBER_PATTERNS),
    bill_date: matchField(text, BILL_DATE_PATTERNS),
    patient_name: matchField(text, PATIENT_NAME_PATTERNS),
    room_rent: {
      rate_per_day: matchAmount(text, ROOM_RENT_RATE_PATTERNS),
      number_of_days: matchField(text, ROOM_RENT_DAYS_PATTERNS),
      total: matchAmount(text, ROOM_RENT_TOTAL_PATTERNS),
    },
    icu_charges: matchAmount(text, ICU_PATTERNS),
    nursing_charges: matchAmount(text, NURSING_PATTERNS),
    doctor_visit_charges: matchAmount(text, DOCTOR_VISIT_PATTERNS),
    surgery_charges: matchAmount(text, SURGERY_PATTERNS),
    anesthesia_charges: matchAmount(text, ANESTHESIA_PATTERNS),
    operation_theatre_charges: matchAmount(text, OT_PATTERNS),
    pharmacy_charges: matchAmount(text, PHARMACY_PATTERNS),
    investigation_charges: matchAmount(text, INVESTIGATION_PATTERNS),
    consumables_charges: matchAmount(text, CONSUMABLES_PATTERNS),
    equipment_charges: matchAmount(text, EQUIPMENT_PATTERNS),
    registration_charges: matchAmount(text, REGISTRATION_PATTERNS),
    miscellaneous_charges: matchAmount(text, MISCELLANEOUS_PATTERNS),
    gross_total: matchAmount(text, GROSS_TOTAL_PATTERNS),
    discount: matchAmount(text, DISCOUNT_PATTERNS),
    net_payable: matchAmount(text, NET_PAYABLE_PATTERNS),
  };

  // Build confidence map — flatten room_rent into individual sub-keys
  const confidence: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "room_rent" && typeof value === "object" && value !== null) {
      const rr = value as HospitalBillData["room_rent"];
      confidence["room_rent.rate_per_day"] = rr.rate_per_day.length > 0;
      confidence["room_rent.number_of_days"] = rr.number_of_days.length > 0;
      confidence["room_rent.total"] = rr.total.length > 0;
    } else {
      confidence[key] = typeof value === "string" && value.length > 0;
    }
  }

  const foundCount = Object.values(confidence).filter(Boolean).length;

  return {
    success: foundCount >= 3,
    data,
    raw_text: text,
    confidence,
  };
}
