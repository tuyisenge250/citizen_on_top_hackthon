import { NextResponse, NextRequest } from "next/server";

export function GET(request: NextRequest) {
    try {
        const response = NextResponse.json({ message: "Success" }, { status: 200 });
        response.cookies.set('token', '', { expires: new Date(0), path: '/' }); 
        return response;
    } catch (error) {
        return NextResponse.json({ message: "Failed to log out" }, { status: 400 });
    }
}