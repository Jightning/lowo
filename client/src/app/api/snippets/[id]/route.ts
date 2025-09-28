import { NextRequest, NextResponse } from 'next/server';
import { updateSnippet, deleteSnippet } from '@/lib/backend/controllers/snippetController';
import { verifyToken } from '@/lib/session';
import { dbConnect } from '@/lib/backend/dbConnect';

// PUT /api/snippets/:id
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    
    const authResult = await verifyToken(request);
    if (!authResult.success) {
        return authResult.response;
    }

    return updateSnippet(request, params.id, authResult.user.id);
}

// DELETE /api/snippets/:id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect()

    const authResult = await verifyToken(request);
    if (!authResult.success) {
        return authResult.response;
    }

    return deleteSnippet(request, params.id, authResult.user.id);
}