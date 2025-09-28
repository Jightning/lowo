import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/session';
import {
    getSnippets,
    createSnippet
} from '@/lib/backend/controllers/snippetController'
import { dbConnect } from '@/lib/backend/dbConnect';


// GET /api/snippets
export async function GET(request: NextRequest) {
    await dbConnect();
    
    const authResult = await verifyToken(request);
    if (!authResult.success) {
        return authResult.response;
    }

    return getSnippets(request, authResult.user.id);
}

// POST /api/snippets
export async function POST(request: NextRequest) {
    await dbConnect()

    const authResult = await verifyToken(request);
    if (!authResult.success) {
        return authResult.response;
    }

    return createSnippet(request, authResult.user.id);
}