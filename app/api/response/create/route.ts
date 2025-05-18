import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, responderId, message } = body;

    if (!submissionId || !responderId || !message) {
      return NextResponse.json(
        { error: "submissionId, responderId, and message are required." },
        { status: 400 }
      );
    }

    const response = await prisma.adminResponse.create({
      data: { submissionId, responderId, message },
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error("Create AdminResponse Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
