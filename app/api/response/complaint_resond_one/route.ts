import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Response ID is required" }, { status: 400 });
    }

    const response = await prisma.adminResponse.findUnique({
      where: { id },
      include: {
        submission: {
          include: {
            category: true,  // include category details
            agency: true,    // include agency details
          },
        },
        responder: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Fetch AdminResponse error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
