import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      name,
      registrationNumber,
      nabhStatus,
      state,
      bedCapacity,
      contactPerson,
      billingEmail,
    } = body;

    // Basic validation
    if (
      !name ||
      !registrationNumber ||
      !nabhStatus ||
      !state ||
      !bedCapacity ||
      !contactPerson ||
      !billingEmail
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    // Check if hospital already exists for this user
    const existingHospital = await prisma.hospital.findUnique({
      where: { ownerId: session.user.id },
    });

    if (existingHospital) {
      return NextResponse.json(
        { error: "A hospital profile already exists for this account." },
        { status: 409 },
      );
    }

    // Create hospital
    const hospital = await prisma.hospital.create({
      data: {
        ownerId: session.user.id,
        name,
        registrationNumber,
        nabhStatus,
        state,
        bedCapacity,
        contactPerson,
        billingEmail,
      },
    });

    return NextResponse.json(
      { message: "Hospital profile created.", hospitalId: hospital.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create hospital error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
