import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface UpdateAgencyBody {
  id: string;
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export async function PUT(req: NextRequest) {
  try {
    const body: UpdateAgencyBody = await req.json();
    const { id, name, description, email, phone, address } = body;

    if (!id) {
      return NextResponse.json({ error: "Agency ID is required." }, { status: 400 });
    }

    const agency = await prisma.agency.findUnique({ where: { id } });
    if (!agency) {
      return NextResponse.json({ error: "Agency not found." }, { status: 404 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (phone && phone.length < 5) {
      return NextResponse.json({ error: "Phone number seems too short." }, { status: 400 });
    }

    const updatedAgency = await prisma.agency.update({
      where: { id },
      data: {
        name,
        description,
        email,
        phone,
        address,
      },
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

    return NextResponse.json(
      { message: "Agency updated successfully.", agency: updatedAgency },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update agency error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
