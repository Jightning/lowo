import { NextRequest, NextResponse } from "next/server"
import { AuthResult } from "@/types"
import jwt from 'jsonwebtoken';
import User from '../models/User';

const db = process.env.NEXT_PUBLIC_DB_ROUTE

// Currently just works by calling within the api routes with their req
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

        // Validating the existence of the user within the db
        const user = await User.findById(decoded.user.id)

        if (!user) {
            return { 
                success: false, 
                response: NextResponse.json({ msg: 'User no longer exists' }, { status: 401 }) 
            };
        }

        // TODO look into implementation of this for when user changes password (embed passwordChangedAt into jwt -> const { decodedUser, pUpdatedAt } = decoded;)
        // const currentDbTimestamp = user.passwordChangedAt.getTime();

        // // The token was issued before the password was last updated/deleted
        // if (pUpdatedAt < currentDbTimestamp) {
        //     return { 
        //         success: false, 
        //         response: NextResponse.json({ msg: 'Session expired' }, { status: 401 }) 
        //     };
        // }

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