import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface UpdateBody {
  id: string;
  title?: string;
  description?: string;
  type?: "COMPLAINT" | "FEEDBACK" | "SUGGESTION";
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  location?: string;
  attachmentUrl?: string;
  categoryId?: string;
  agencyId?: string;
}

export async function PUT(req: NextRequest) {
  try {
    const body: UpdateBody = await req.json();
    const { id, categoryId, agencyId, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Submission id is required." },
        { status: 400 }
      );
    }

    // make sure it exists
    await prisma.submission.findUniqueOrThrow({ where: { id } });

    // build your update payload
    const updateData: Record<string, any> = { ...rest };

    if (categoryId) {
      await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });
      updateData.categoryId = categoryId;
    }

    if (agencyId) {
      await prisma.agency.findUniqueOrThrow({ where: { id: agencyId } });
      updateData.agencyId = agencyId;
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        categoryId: true,
        agencyId: true,
        location: true,
        attachmentUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "Submission updated.", submission: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
