import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, message } = body;

    if (!id || !message) {
      return NextResponse.json(
        { error: "Response ID and new message are required." },
        { status: 400 }
      );
    }

    const updated = await prisma.adminResponse.update({
      where: { id },
      data: { message },
    });

    return NextResponse.json({ updated }, { status: 200 });
  } catch (error) {
    console.error("Update AdminResponse Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
