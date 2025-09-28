'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server"
import { AuthResult } from "@/types"

export async function verifyToken(req: NextRequest): Promise<AuthResult> {
    const token = req.headers.get('x-auth-token');
    const jwtSecret = process.env.JWT_SECRET;
 
    if (!token) {
        return { 
            success: false, 
            response: NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 }) 
        };
    }
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined.");
        return { 
            success: false, 
            response: NextResponse.json({ msg: 'Server configuration error' }, { status: 500 }) 
        };
    }

    try {
        const decoded: any = jwt.verify(token, jwtSecret);
        if (!decoded.user) {
             return { 
                success: false, 
                response: NextResponse.json({ msg: 'Token payload malformed' }, { status: 401 }) 
            };
        }

        return { 
            success: true, 
            user: decoded.user 
        };

    } catch (err) {
        return { 
            success: false, 
            response: NextResponse.json({ msg: 'Token is not valid or expired' }, { status: 401 }) 
        };
    }
}

// Like verify token but uses cookies instead of a direct token input through res
export async function getToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value;
    const jwtSecret = process.env.JWT_SECRET;

    if (!token) {
        return null
    }
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined.");
        return null
    }

    try {
        const decoded: any = jwt.verify(token, jwtSecret);

        if (!decoded.user) {
             return null
        }

        return token

    } catch (err) {
        return null
    }
}

export async function createSession(token: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const cookieStore = await cookies()
    
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function updateSession() {
    const token = (await cookies()).get('session')?.value
    if (!token) {
        return null
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  
    if (!decoded) {
        return null
    }
  
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}