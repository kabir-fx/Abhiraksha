// ─── Discharge Summary ────────────────────────────────────────────
export interface DischargeSummaryData {
  patient_name: string;
  age: string;
  gender: string;
  uhid_number: string;
  admission_date: string;
  discharge_date: string;
  primary_diagnosis: string;
  secondary_diagnosis: string;
  procedure_performed: string;
  clinical_summary: string;
  treatment_given: string;
  condition_at_discharge: string;
  doctor_name: string;
  doctor_registration_number: string;
}

// ─── Insurance Policy ─────────────────────────────────────────────
export interface InsurancePolicyData {
  policy_number: string;
  insured_name: string;
  insurer: string;
  tpa_name: string;
  sum_insured: string;
  policy_period_start: string;
  policy_period_end: string;
  plan_type: string;
  coverage_type: string;
}

// ─── Hospital Bill ────────────────────────────────────────────────
export interface HospitalBillData {
  bill_number: string;
  bill_date: string;
  patient_name: string;
  room_rent: {
    rate_per_day: string;
    number_of_days: string;
    total: string;
  };
  icu_charges: string;
  nursing_charges: string;
  doctor_visit_charges: string;
  surgery_charges: string;
  anesthesia_charges: string;
  operation_theatre_charges: string;
  pharmacy_charges: string;
  investigation_charges: string;
  consumables_charges: string;
  equipment_charges: string;
  registration_charges: string;
  miscellaneous_charges: string;
  gross_total: string;
  discount: string;
  net_payable: string;
}

// ─── Extraction Result Wrapper ────────────────────────────────────
export interface ExtractionResult<T> {
  success: boolean;
  data: T | null;
  raw_text: string;
  confidence: Record<string, boolean>; // which fields were found
  error?: string;
}

export type DocumentType = "insurance" | "discharge" | "bill";
