import { NextRequest, NextResponse } from 'next/server';
import User from '../models/User'
import { dbConnect } from '@/lib/backend/dbConnect';

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
export const getUser = async (req: NextRequest, userId: string) => {
    try {
        await dbConnect()

        const user = await User.find({ user: userId }).sort({ name: 1 });
        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        console.error("Error retrieving user:", (err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};