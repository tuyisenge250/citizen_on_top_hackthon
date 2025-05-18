import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Agency ID is required." }, { status: 400 });
    }

    const agency = await prisma.agency.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!agency) {
      return NextResponse.json({ error: "Agency not found." }, { status: 404 });
    }

    return NextResponse.json({ agency }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch agency:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
