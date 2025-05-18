import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const responses = await prisma.adminResponse.findMany({
      where: {
        submission: {
          type: "COMPLAINT",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        submission: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            category: {
              select: { name: true },
            },
            agency: {
              select: { name: true },
            },
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

    return NextResponse.json({ responses }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch complaint responses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve complaint responses" },
      { status: 500 }
    );
  }
}
