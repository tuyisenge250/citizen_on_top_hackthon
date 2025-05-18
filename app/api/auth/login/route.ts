import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import bcrypt from 'bcrypt'
import { generateToken } from "@/util";

export async function POST(request: NextRequest, res: NextResponse) {
    const body = await request.json()
    const { password, email } = body
    try{
        const userExit = await prisma.user.findUnique({
            where: { email }
        })
        if (!userExit){
            return new Response(JSON.stringify({ error : "you number Not founded try again or creat account" }),{
                status: 400,
                headers : {
                    "Component-Type": "Applicaton/json",
                }
            })
        }
        const isRealPassword = await bcrypt.compare(password, userExit.password)
        if (!isRealPassword){
            return new Response(JSON.stringify({"message":"wrong user password Try again"}),{
                status: 403
            }) 
        }
        const token = await generateToken(userExit, "1h")
        const response = NextResponse.json( {user: userExit,
        success: true })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
        })
        return response

    }catch(error){
        if (error instanceof Error){
            return new Response(JSON.stringify({error : error.message}),{
                status: 500,
                headers : {
                    "Component-Type": "Applicaton/json",
                }
            })
        } 
    }
}