// File: app/api/submission/complaints/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const complaints = await prisma.submission.findMany({
      where: { type: "COMPLAINT" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        category: {
          select: { id: true, name: true }
        },
        agency: {
          select: { id: true, name: true }
        },
        responses: {
          select: { id: true, message: true, createdAt: true },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    return NextResponse.json({ complaints }, { status: 200 });
  } catch (error) {
    console.error("Fetch all complaints error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
