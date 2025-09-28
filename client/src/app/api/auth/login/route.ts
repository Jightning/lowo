import { login } from '@/lib/backend/controllers/authController'
import { dbConnect } from '@/lib/backend/dbConnect';
import { NextRequest } from 'next/server';

// POST /api/auth/login
export async function POST(request: NextRequest) {
    await dbConnect()
    return login(request);
}