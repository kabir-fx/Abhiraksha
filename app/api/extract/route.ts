import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { extractTextFromPdf } from "@/lib/extractors/pdf-parser";
import { extractDischargeSummaryAI } from "@/lib/extractors/ai-extractor";
import { extractInsurancePolicy } from "@/lib/extractors/insurance-policy";
import { extractHospitalBill } from "@/lib/extractors/hospital-bill";
import type { DocumentType } from "@/lib/extractors/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as DocumentType | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!type || !["insurance", "discharge", "bill"].includes(type)) {
      return NextResponse.json(
        {
          error:
            "Invalid document type. Must be 'insurance', 'discharge', or 'bill'.",
        },
        { status: 400 },
      );
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted." },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const rawText = await extractTextFromPdf(buffer);

    console.log("RAW TEXT:\n", rawText.substring(0, 2000));

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be a scanned image — text-based PDFs are currently supported.",
        },
        { status: 422 },
      );
    }

    // Run the appropriate extractor
    let result;
    if (type === "discharge") {
      result = await extractDischargeSummaryAI(rawText);
    } else if (type === "bill") {
      result = extractHospitalBill(rawText);
    } else {
      result = extractInsurancePolicy(rawText);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to process the PDF. Please try again." },
      { status: 500 },
    );
  }
}
