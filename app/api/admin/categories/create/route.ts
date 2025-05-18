import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface CreateCategoryBody {
  name: string;
  agencyId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, agencyId }: CreateCategoryBody = await req.json();

    if (!name || !agencyId) {
      return NextResponse.json(
        { error: "name and agencyId are required." },
        { status: 400 }
      );
    }

    // Optional: check the agency exists
    const agencyExists = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agencyExists) {
      return NextResponse.json({ error: "Agency not found." }, { status: 404 });
    }

    const category = await prisma.category.create({
      data: { name, agencyId },
      select: {
        id: true,
        name: true,
        agencyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "Category created.", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
