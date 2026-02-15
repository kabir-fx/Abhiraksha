"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface ExtractionResultsProps {
  type: "insurance" | "discharge" | "bill";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  confidence: Record<string, boolean>;
}

const FIELD_LABELS: Record<string, Record<string, string>> = {
  discharge: {
    patient_name: "Patient Name",
    age: "Age",
    gender: "Gender",
    uhid_number: "UHID / MRN",
    admission_date: "Admission Date",
    discharge_date: "Discharge Date",
    primary_diagnosis: "Primary Diagnosis",
    secondary_diagnosis: "Secondary Diagnosis",
    procedure_performed: "Procedure Performed",
    clinical_summary: "Clinical Summary",
    treatment_given: "Treatment Given",
    condition_at_discharge: "Condition at Discharge",
    doctor_name: "Doctor Name",
    doctor_registration_number: "Doctor Reg. No.",
  },
  insurance: {
    policy_number: "Policy Number",
    patient_name: "Patient Name",
    bill_number: "Bill Number",
    admission_date: "Admission Date",
    length_of_stay_days: "Length of Stay (Days)",
    gross_total: "Gross Total",
    discount: "Discount",
    net_payable: "Net Payable",
    per_day_rate: "Room Rent (Rate/Day)",
    days: "Room Rent (Days)",
    room_rent_total: "Room Rent Total",
    icu_total: "ICU Charges",
    icu_days: "ICU Days",
    doctor_visit_charges: "Doctor Visit Charges",
    surgery_charges: "Surgery Charges",
    anesthesia_charges: "Anesthesia Charges",
    procedure_total: "Procedure Total",
    ot_charges: "OT Charges",
    equipment_charges: "Equipment Charges",
    pharmacy_charges: "Pharmacy Charges",
    investigation_charges: "Investigation Charges",
    nursing_charges: "Nursing Charges",
    consumables_charges: "Consumables Charges",
    miscellaneous_charges: "Miscellaneous Charges",
  },
  bill: {
    bill_number: "Bill Number",
    bill_date: "Bill Date",
    patient_name: "Patient Name",
    "room_rent.rate_per_day": "Room Rent — Rate/Day",
    "room_rent.number_of_days": "Room Rent — Days",
    "room_rent.total": "Room Rent — Total",
    icu_charges: "ICU Charges",
    nursing_charges: "Nursing Charges",
    doctor_visit_charges: "Doctor Visit Charges",
    surgery_charges: "Surgery Charges",
    anesthesia_charges: "Anesthesia Charges",
    operation_theatre_charges: "OT Charges",
    pharmacy_charges: "Pharmacy Charges",
    investigation_charges: "Investigation Charges",
    consumables_charges: "Consumables",
    equipment_charges: "Equipment Charges",
    registration_charges: "Registration Charges",
    miscellaneous_charges: "Miscellaneous",
    gross_total: "Gross Total",
    discount: "Discount",
    net_payable: "Net Payable",
  },
};

export default function ExtractionResults({
  type,
  data,
  confidence,
}: ExtractionResultsProps) {
  const labels = FIELD_LABELS[type] || {};
  const entries = Object.entries(labels);
  const foundCount = Object.values(confidence).filter(Boolean).length;
  const totalCount = entries.length;

  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Extracted Fields
        </h4>
        <span className="text-xs text-gray-400">
          {foundCount}/{totalCount} fields found
        </span>
      </div>
      <div className="space-y-2">
        {entries.map(([key, label]) => {
          const found = confidence[key];
          const value = key.includes(".")
            ? (key
                .split(".")
                .reduce(
                  (obj: Record<string, unknown>, k: string) =>
                    (obj?.[k] as Record<string, unknown>) ?? {},
                  data as Record<string, unknown>,
                ) as unknown as string)
            : data[key] || "";
          return (
            <div
              key={key}
              className={`flex items-start gap-2 p-2.5 rounded-lg text-sm ${
                found
                  ? "bg-emerald-50/50 border border-emerald-100"
                  : "bg-gray-50 border border-gray-100"
              }`}
            >
              {found ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <span className="text-gray-400 text-xs uppercase tracking-wider">
                  {label}
                </span>
                <p
                  className={`mt-0.5 break-words ${
                    found ? "text-gray-900 font-medium" : "text-gray-400 italic"
                  }`}
                >
                  {found ? value : "Not found"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
