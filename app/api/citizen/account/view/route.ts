import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { id } = body
    console.log(id)
    try{
        const userExit = await prisma.user.findUnique({
            where: { id }
        })
        if (!userExit){
            return new Response(JSON.stringify({ error : "you number Not founded try again or creat account" }),{
                status: 400,
                headers : {
                    "Component-Type": "Applicaton/json",
                }
            })
        }
        const response = NextResponse.json( {user: userExit,
        success: true })
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