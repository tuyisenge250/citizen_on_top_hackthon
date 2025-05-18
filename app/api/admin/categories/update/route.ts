import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface UpdateCategoryBody {
  id: string;
  name?: string;
  agencyId?: string;
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, agencyId }: UpdateCategoryBody = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Category id is required." }, { status: 400 });
    }

    const categoryExists = await prisma.category.findUnique({ where: { id } });
    if (!categoryExists) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    if (agencyId) {
      const agencyExists = await prisma.agency.findUnique({ where: { id: agencyId } });
      if (!agencyExists) {
        return NextResponse.json({ error: "Agency not found." }, { status: 404 });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
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
      { message: "Category updated.", category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
