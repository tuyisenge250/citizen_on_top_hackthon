import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const type       = searchParams.get("type")?.toUpperCase(); 

    if (!categoryId) {
      return NextResponse.json(
        { error: "Query param categoryId is required." },
        { status: 400 }
      );
    }

    if (type !== "COMPLAINT" && type !== "FEEDBACK") {
      return NextResponse.json(
        { error: 'Query param type must be "COMPLAINT" or "FEEDBACK".' },
        { status: 400 }
      );
    }

    const submissions = await prisma.submission.findMany({
      where: { categoryId, type },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        type: true,
        createdAt: true,
        user: { select: { firstName: true, lastName: true } },
        agency: { select: { name: true } },
      },
    });

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Fetch submissions by category error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
