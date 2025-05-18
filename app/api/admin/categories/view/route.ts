import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        agencyId: true,
        createdAt: true,
        updatedAt: true,
        agency: { select: { name: true } },
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("View-all categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
