import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGenerativeModel } from "@/lib/ai";

const MODEL_NAME = "gemini-2.5-flash";

const CLASSIFICATION_PROMPT = `Role: You are a Senior Medical Claims Adjudicator. Your task is to analyze hospital billing and discharge JSON data to determine the "Claim Status" (Accepted, Rejected, or Pending).

Input Data:
{INPUT_JSON}

Instructions:
Evaluate the claim based on the following four pillars:

1. Medical Necessity & Alignment:
   - Does the procedure_performed align with the primary_diagnosis?
   - Is the length_of_stay_days medically justifiable for this specific procedure?

2. Billing Consistency & Math Accuracy:
   - Verify if room_rent rate_per_day × number_of_days matches the room_rent_total.
   - Verify if the sum of all individual charges in the bill section equals the gross_total.
   - Ensure the net_payable correctly subtracts the discount from the gross_total.

3. Administrative Completeness:
   - Check for missing critical identifiers (e.g., uhid_number, policy_number, doctor_registration_number).
   - Ensure admission_date and discharge_date are consistent across the insurance, discharge, and bill objects.

4. Red Flags:
   - Look for discrepancies in patient names (e.g., "Rahul Verma" vs "Mr. Rahul Verma").
   - Identify if any "Secondary Diagnosis" could be a pre-existing condition exclusion under standard policies.

You MUST respond with ONLY valid JSON matching this exact structure, no markdown code blocks or other text:
{
  "decision": "Accepted" | "Rejected" | "Pending",
  "confidence_score": <number 0-100>,
  "reasoning": ["<bullet point 1>", "<bullet point 2>", ...],
  "missing_info": ["<missing field 1>", "<missing field 2>", ...]
}`;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { insurance, discharge, bill } = body;

    if (!insurance && !discharge && !bill) {
      return NextResponse.json(
        { error: "At least one section of data is required for analysis." },
        { status: 400 },
      );
    }

    const consolidatedJson = JSON.stringify(
      { insurance, discharge, bill },
      null,
      2,
    );

    const prompt = CLASSIFICATION_PROMPT.replace(
      "{INPUT_JSON}",
      consolidatedJson,
    );

    const model = getGenerativeModel(MODEL_NAME);
    const result = await model.generateContent([prompt]);
    const response = result.response;
    const responseText = response.text();

    // Clean up markdown code blocks if present
    const jsonString = responseText
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "");

    const verdict = JSON.parse(jsonString);

    // Validate response structure
    if (
      !verdict.decision ||
      !["Accepted", "Rejected", "Pending"].includes(verdict.decision)
    ) {
      throw new Error("Invalid decision in AI response");
    }

    return NextResponse.json({
      success: true,
      verdict: {
        decision: verdict.decision,
        confidence_score: Number(verdict.confidence_score) || 0,
        reasoning: Array.isArray(verdict.reasoning) ? verdict.reasoning : [],
        missing_info: Array.isArray(verdict.missing_info)
          ? verdict.missing_info
          : [],
      },
    });
  } catch (error) {
    console.error("Claim analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze the claim. Please try again." },
      { status: 500 },
    );
  }
}
