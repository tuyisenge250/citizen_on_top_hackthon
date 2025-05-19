// app/api/submissions/by-user-agency/route.ts

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    console.log(userId)
    if (!userId) {
      return NextResponse.json(
        { error: "Request body must include userId." },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { agencyId: true },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }
    const { agencyId } = user
    if (!agencyId) {
      return NextResponse.json(
        { error: "This user is not assigned to any agency." },
        { status: 400 }
      )
    }

    // 2) fetch submissions for that agency
    const submissions = await prisma.submission.findMany({
      where: { agencyId },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        agency:  { select: { name: true } },
        user:    { select: { firstName: true, lastName: true, email: true } },
        responses: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            message: true,
            createdAt: true,
            responder: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ submissions }, { status: 200 })
  } catch (err) {
    console.error("Fetch submissions by user‐agency error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
