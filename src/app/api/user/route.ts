import { NextRequest } from 'next/server';
import { 
    getUser,
} from '@/lib/backend/controllers/userController';
import { verifyToken } from '@/lib/backend/middleware/auth';

// GET /api/categories
export async function GET(request: NextRequest) {
    const authResult = await verifyToken(request);
    
    if (!authResult.success) {
        return authResult.response; 
    }
    return getUser(request, authResult.user.id);
}