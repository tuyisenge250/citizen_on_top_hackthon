import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId");
    const rawType  = searchParams.get("type")?.toUpperCase();

    if (!agencyId) {
      return NextResponse.json(
        { error: "Query param agencyId is required." },
        { status: 400 }
      );
    }

    if (rawType !== "COMPLAINT" && rawType !== "FEEDBACK") {
      return NextResponse.json(
        { error: 'Query param type must be "COMPLAINT" or "FEEDBACK".' },
        { status: 400 }
      );
    }

    const type = rawType as "COMPLAINT" | "FEEDBACK";

    const submissions = await prisma.submission.findMany({
      where: { agencyId, type },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        type: true,
        createdAt: true,
        category: { select: { name: true } },
        user:     { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Fetch submissions by agency error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
