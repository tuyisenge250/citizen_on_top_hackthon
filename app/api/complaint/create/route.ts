import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface CreateBody {
  userId:      string;
  categoryId:  string;
  agencyId:    string;
  title:       string;
  description: string;
  type?:       "COMPLAINT" | "FEEDBACK" | "SUGGESTION";
  location?:   string;
  attachmentUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      categoryId,
      agencyId,
      title,
      description,
      type = "COMPLAINT",
      location,
      attachmentUrl,
    }: CreateBody = await req.json();

    if (!userId || !categoryId || !agencyId || !title || !description) {
      return NextResponse.json(
        { error: "userId, categoryId, agencyId, title, description are required." },
        { status: 400 }
      );
    }

    await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.category.findUniqueOrThrow({ where: { id: categoryId } }),
      prisma.agency.findUniqueOrThrow({ where: { id: agencyId } }),
    ]);

    const submission = await prisma.submission.create({
      data: {
        userId,
        categoryId,
        agencyId,
        title,
        description,
        type,
        location,
        attachmentUrl,
      },
      select: {
        id: true,
        userId: true,
        categoryId: true,
        agencyId: true,
        title: true,
        description: true,
        type: true,
        status: true,
        location: true,
        attachmentUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "Submission created.", submission },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
