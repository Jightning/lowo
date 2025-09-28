import { NextRequest, NextResponse } from 'next/server';
import { 
    updateCategory,
    deleteCategory 
} from '@/lib/backend/controllers/categoryController';
import { verifyToken } from '@/lib/session';
import { dbConnect } from '@/lib/backend/dbConnect';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect()
    const authResult = await verifyToken(request);

    if (!authResult.success) {
        return authResult.response; 
    }

    const categoryId = params.id;
    return updateCategory(request, categoryId, authResult.user.id);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect()
    const authResult = await verifyToken(request);

    if (!authResult.success) {
        return authResult.response; 
    }

    const categoryId = params.id;
    return deleteCategory(request, categoryId, authResult.user.id);
}