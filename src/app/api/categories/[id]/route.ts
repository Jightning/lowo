import { NextRequest, NextResponse } from 'next/server';
import { 
    updateCategory,
    deleteCategory 
} from '@/lib/backend/controllers/categoryController';
import { verifyToken } from '@/lib/backend/middleware/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await verifyToken(request);

    if (!authResult.success) {
        return authResult.response; 
    }

    const { id } = await params;
    return updateCategory(request, id, authResult.user.id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await verifyToken(request);

    if (!authResult.success) {
        return authResult.response; 
    }

    const { id } = await params;
    return deleteCategory(request, id, authResult.user.id);
}