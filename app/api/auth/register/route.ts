import { NextRequest } from "next/server";
import bcrypt from 'bcrypt'
import    prisma   from "@/lib/prisma";
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { firstName, lastName, email, password, phone } = body

        // Check if user already exists based on email
        const userExist = await prisma.user.findUnique({
            where: { email }
        })

        if (userExist) {
            return new Response(JSON.stringify({ error: "Account already exists, please login instead." }), {
                status: 409,
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }

        // Validate phone number (10 digits and starts with 078, 079, or 073)
        if (phone.length !== 10 || !["078", "079", "073"].includes(phone.slice(0, 3))) {
            return new Response(JSON.stringify({ error: "Invalid phone number. It must be 10 digits and start with 078, 079, or 073." }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }

        // Validate password
        if (password.length < 5) {
            return new Response(JSON.stringify({ error: "Password must be at least 5 characters long." }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user in Prisma
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone
            }
        })

        return new Response(JSON.stringify({ message: "User created successfully." }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
    }
}
