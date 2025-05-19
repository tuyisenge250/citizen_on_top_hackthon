import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

type UpdateBody = {
  id: string;
  email: string;
} & Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  password: string;
}>;

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as UpdateBody;
    const { id, email, password, phone, ...rest } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: "Both id and email are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { ...rest };

    if (phone !== undefined) {
      if (phone.length !== 10 || !["078", "079", "073"].includes(phone.slice(0, 3))) {
        return NextResponse.json(
          { error: "Phone must be 10 digits and start with 078, 079, or 073." },
          { status: 400 }
        );
      }
      updateData.phone = phone;
    }

    if (password !== undefined) {
      if (password.length < 5) {
        return NextResponse.json(
          { error: "Password must be at least 5 characters long." },
          { status: 400 }
        );
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...safeUser } = updatedUser;

    return NextResponse.json(
      { message: "User updated.", user: safeUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
