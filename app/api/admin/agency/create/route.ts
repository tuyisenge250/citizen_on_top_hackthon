import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** Body the client must send */
interface CreateAgencyBody {
  name:        string;
  description?: string;
  email?:       string;
  phone?:       string;
  address?:     string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateAgencyBody = await req.json();
    const { name, description, email, phone, address } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Agency name is required." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }
    if (phone && phone.length < 5) {
      return NextResponse.json(
        { error: "Phone number seems too short." },
        { status: 400 }
      );
    }

    const agency = await prisma.agency.create({
      data: { name, description, email, phone, address },
      select: {                      // return only the basics
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
      { message: "Agency created.", agency },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create agency error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
