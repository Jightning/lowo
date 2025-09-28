import { NextRequest, NextResponse } from 'next/server';
import { 
    getCategories,
    createCategory 
} from '@/lib/backend/controllers/categoryController';
import { verifyToken } from '@/lib/session';
import { dbConnect } from '@/lib/backend/dbConnect';

// GET /api/categories
export async function GET(request: NextRequest) {
    await dbConnect()
    const authResult = await verifyToken(request);
    
    if (!authResult.success) {
        return authResult.response; 
    }
    return getCategories(request, authResult.user.id);
}

// POST /api/categories
export async function POST(request: NextRequest) {
    await dbConnect()
    const authResult = await verifyToken(request);

    if (!authResult.success) {
        return authResult.response; 
    }

    return createCategory(request, authResult.user.id);
}