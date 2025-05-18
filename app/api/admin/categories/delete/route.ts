import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    // Expect JSON body: { "id": "category-uuid" }
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Category id is required." }, { status: 400 });
    }

    // Check existence first (optional but returns cleaner 404)
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json(
      { message: `Category ${id} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
