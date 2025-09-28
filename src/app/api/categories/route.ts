import { NextRequest, NextResponse } from 'next/server';
import { 
    getCategories,
    createCategories 
} from '@/lib/backend/controllers/categoryController';
import { verifyToken } from '@/lib/session';

// GET /api/categories
export async function GET(request: NextRequest) {
    const authResult = await verifyToken(request);
    
    if (!authResult.success) {
        return authResult.response; 
    }
    return getCategories(request, authResult.user.id);
}

// POST /api/categories
export async function POST(request: NextRequest) {
    const authResult = await verifyToken(request);

    if (!authResult.success) {
        return authResult.response; 
    }

    return createCategories(request, authResult.user.id);
}