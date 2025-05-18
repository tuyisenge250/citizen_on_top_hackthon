import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Submission id is required." }, { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        agency:   { select: { name: true } },
        user:     { select: { firstName: true, lastName: true } },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    return NextResponse.json({ submission }, { status: 200 });
  } catch (error) {
    console.error("View-one submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
