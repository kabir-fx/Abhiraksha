import type { InsurancePolicyData, ExtractionResult } from "./types";

/**
 * Multi-pattern field extractor.
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

// ── Regex patterns for Insurance Policy fields ────────────────────

const POLICY_NUMBER_PATTERNS = [
  /(?:Policy\s*(?:No\.?|Number)|Certificate\s*(?:No\.?|Number)|Claim\s*(?:No\.?|Number))\s*[:\-–]\s*([A-Za-z0-9\-\/]+)/i,
  /(?:Policy\s*#)\s*[:\-–]?\s*([A-Za-z0-9\-\/]+)/i,
];

const INSURED_NAME_PATTERNS = [
  /(?:Insured\s*(?:Name)?|Name\s*of\s*(?:the\s+)?(?:Insured|Policy\s*Holder)|Policy\s*Holder\s*(?:Name)?|Member\s*Name|Employee\s*Name|Proposer\s*Name)\s*[:\-–]\s*(.+?)(?:\n|$)/i,
  /(?:Patient\s*Name|Name\s*of\s*(?:the\s+)?Patient)\s*[:\-–]\s*(.+?)(?:\n|$)/i,
];

const INSURER_PATTERNS = [
  /(?:Insurance\s*Company|Insurer|Underwritten\s*by|Payer\s*(?:Name)?|Insurance\s*Provider)\s*[:\-–]\s*(.+?)(?:\n|$)/i,
  // Common Indian insurer names as fallback
  /((?:Star\s*Health|ICICI\s*Lombard|HDFC\s*Ergo|Bajaj\s*Allianz|New\s*India\s*Assurance|National\s*Insurance|United\s*India|Oriental\s*Insurance|Niva\s*Bupa|Care\s*Health|Max\s*Bupa|Religare|Aditya\s*Birla|Tata\s*AIG|SBI\s*General|Digit|Acko|Go\s*Digit|Chola\s*MS|Future\s*Generali|Iffco\s*Tokio|Kotak\s*General|Liberty\s*General|Magma\s*HDI|Manipal\s*Cigna|ManipalCigna|Raheja\s*QBE|Reliance\s*General|Royal\s*Sundaram|Shriram\s*General)(?:\s*(?:Insurance|Health|General))?(?:\s*(?:Co\.?|Company|Ltd\.?))?)/i,
];

const TPA_PATTERNS = [
  /(?:TPA|Third\s*Party\s*Administrator|TPA\s*Name)\s*[:\-–]\s*(.+?)(?:\n|$)/i,
  /((?:Medi\s*Assist|Paramount|Family\s*Health\s*Plan|Vidal|Health\s*India|Raksha|MD\s*India|Heritage|Anyuta|Medsave|Good\s*Health|Dedicated|East\s*West|Genins|Park|Anmol\s*Medicare|Ericson|Safeway|United\s*Healthcare)(?:\s*(?:TPA|Insurance|Health))?(?:\s*(?:Services|Solutions|Ltd\.?|Pvt\.?|Private|Limited))*)/i,
];

const SUM_INSURED_PATTERNS = [
  /(?:Sum\s*Insured|Sum\s*Assured|Coverage\s*Amount|SI|Total\s*(?:Sum\s*)?(?:Insured|Coverage))\s*[:\-–]\s*(?:Rs\.?\s*|INR\s*|₹\s*)?([0-9,]+(?:\.\d{2})?)/i,
  /(?:Rs\.?\s*|INR\s*|₹\s*)([0-9,]+(?:\.\d{2})?)\s*(?:sum\s*insured|coverage)/i,
];

const POLICY_START_PATTERNS = [
  /(?:Policy\s*(?:Start|From|Commencement)\s*Date|(?:Start|From|Commencement)\s*Date|Period\s*(?:of\s*Insurance\s*)?From|Inception\s*Date|Valid\s*From|Effective\s*(?:From|Date))\s*[:\-–]\s*(.+?)(?:\n|$|To\b|to\b)/i,
];

const POLICY_END_PATTERNS = [
  /(?:Policy\s*(?:End|Expiry|To)\s*Date|(?:End|Expiry|To)\s*Date|Period\s*(?:of\s*Insurance\s*)?To|Expiry|Valid\s*(?:To|Till|Until))\s*[:\-–]\s*(.+?)(?:\n|$)/i,
];

const PLAN_TYPE_PATTERNS = [
  /(?:Plan\s*(?:Name|Type)|Product\s*(?:Name|Type)|Scheme|Policy\s*Type)\s*[:\-–]\s*(.+?)(?:\n|$)/i,
  /((?:Individual|Family\s*Floater|Group|Corporate|Top[\s-]*Up|Super\s*Top[\s-]*Up)\s*(?:Plan|Policy|Health\s*(?:Insurance|Plan))?)/i,
];

const COVERAGE_TYPE_PATTERNS = [
  /(?:Coverage\s*Type|Type\s*of\s*(?:Cover(?:age)?|Insurance|Policy))\s*[:\-–]\s*(.+?)(?:\n|$)/i,
  /((?:Mediclaim|Health\s*Insurance|Group\s*(?:Health|Mediclaim)|Comprehensive|Critical\s*(?:Illness|Care)|Personal\s*Accident|Cashless|Reimbursement)(?:\s*(?:Policy|Cover|Plan))?)/i,
];

/**
 * Extracts structured insurance policy fields from raw PDF text.
 */
export function extractInsurancePolicy(
  text: string,
): ExtractionResult<InsurancePolicyData> {
  const data: InsurancePolicyData = {
    policy_number: matchField(text, POLICY_NUMBER_PATTERNS),
    insured_name: matchField(text, INSURED_NAME_PATTERNS),
    insurer: matchField(text, INSURER_PATTERNS),
    tpa_name: matchField(text, TPA_PATTERNS),
    sum_insured: matchField(text, SUM_INSURED_PATTERNS),
    policy_period_start: matchField(text, POLICY_START_PATTERNS),
    policy_period_end: matchField(text, POLICY_END_PATTERNS),
    plan_type: matchField(text, PLAN_TYPE_PATTERNS),
    coverage_type: matchField(text, COVERAGE_TYPE_PATTERNS),
  };

  // Build confidence map
  const confidence: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(data)) {
    confidence[key] = value.length > 0;
  }

  const foundCount = Object.values(confidence).filter(Boolean).length;

  return {
    success: foundCount >= 2,
    data,
    raw_text: text,
    confidence,
  };
}
