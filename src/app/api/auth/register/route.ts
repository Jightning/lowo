import { register } from '@/lib/backend/controllers/authController'
import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/backend/dbConnect';

// POST /api/auth/register
export async function POST(request: NextRequest) {
    await dbConnect()
    return register(request);
} 