import { NextRequest } from 'next/server';
import { updateSnippet, deleteSnippet } from '@/lib/backend/controllers/snippetController';
import { verifyToken } from '@/lib/backend/middleware/auth';
import { dbConnect } from '@/lib/backend/dbConnect';
 
// PUT /api/snippets/:id
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    
    const authResult = await verifyToken(request);
    if (!authResult.success) {
        return authResult.response;
    }

    const { id } = await params;
    return updateSnippet(request, id, authResult.user.id);
}

// DELETE /api/snippets/:id
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect()

    const authResult = await verifyToken(request);
    if (!authResult.success) {
        return authResult.response;
    }

    const { id } = await params;
    return deleteSnippet(request, id, authResult.user.id);
}