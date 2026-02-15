import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { policyNumber } = await request.json();

    if (!policyNumber) {
      return NextResponse.json(
        { error: "Policy number is required" },
        { status: 400 },
      );
    }

    const policy = await prisma.insurancePolicy.findUnique({
      where: { policyNumber: String(policyNumber) },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Policy not found. Please check the policy number." },
        { status: 404 },
      );
    }

    // Map camelCase DB fields to snake_case for frontend consistency
    const formattedData = {
      policy_number: policy.policyNumber,
      patient_name: policy.patientName,
      bill_number: policy.billNumber,
      admission_date: policy.admissionDate,
      length_of_stay_days: policy.lengthOfStayDays,
      gross_total: policy.grossTotal,
      discount: policy.discount,
      net_payable: policy.netPayable,

      // Room Rent
      per_day_rate: policy.perDayRate,
      days: policy.days,
      room_rent_total: policy.roomRentTotal,

      // ICU
      icu_total: policy.icuTotal,
      icu_days: policy.icuDays,

      // Procedures
      doctor_visit_charges: policy.doctorVisitCharges,
      surgery_charges: policy.surgeryCharges,
      anesthesia_charges: policy.anesthesiaCharges,
      procedure_total: policy.procedureTotal,

      // Other Charges
      ot_charges: policy.otCharges,
      equipment_charges: policy.equipmentCharges,
      pharmacy_charges: policy.pharmacyCharges,
      investigation_charges: policy.investigationCharges,
      nursing_charges: policy.nursingCharges,
      consumables_charges: policy.consumablesCharges,
      miscellaneous_charges: policy.miscellaneousCharges,
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
      raw_text: "Database Lookup",
      confidence: Object.keys(formattedData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      ),
    });
  } catch (error) {
    console.error("Policy lookup error:", error);
    return NextResponse.json(
      { error: "Failed to perform policy lookup" },
      { status: 500 },
    );
  }
}
