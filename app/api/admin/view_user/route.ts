import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        district: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "No users found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ users }, { status: 200 });

  } catch (error: unknown) {
    console.error("Failed to fetch users:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to fetch users",
          details: error.message,
          // Only include stack trace in development
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        },
        { status: 500 }
      );
    }

    // Fallback for unknown error types
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}