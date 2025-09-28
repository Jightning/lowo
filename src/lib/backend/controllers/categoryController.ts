import { NextRequest, NextResponse } from 'next/server';
import Category from '../models/Category'
import { Category as CategoryType } from '@/types';
import { dbConnect } from '@/lib/backend/dbConnect';
import { Types } from 'mongoose';

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
export const getCategories = async (req: NextRequest, userId: string) => {
    try {
        await dbConnect()

        const categories = await Category.find({ user: userId }).sort({ name: 1 });
        return NextResponse.json(categories, { status: 200 });
    } catch (err) {
        console.error("Error retrieving categories:", (err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
export const createCategories = async (req: NextRequest, userId: string) => {
    let data = await req.json()
    if (typeof data !== 'object') data = JSON.parse(data)
    let dataArray = []

    if (data.length <= 0) {
        return NextResponse.json({ message: 'Invalid payload type: must include at least one object' }, { status: 400 });
    }

    // handle both single object or list of objects
    if (Array.isArray(data)) {
        dataArray = data.map((d) => ({...d, user: userId}));
    } else if (typeof data === 'object' && data !== null) {
        dataArray = [{...data, user: userId}];
    } else {
        return NextResponse.json({ message: 'Invalid payload type' }, { status: 400 });
    }
    
    try {
        await dbConnect()

        const categories = await Category.insertMany(dataArray);
        return NextResponse.json(categories, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
export const updateCategory = async (req: NextRequest, paramId: string, userId: string) => {
    const { name, description, dateCreated, dateUpdated, color, icon }: CategoryType = (await req.json() as CategoryType);
        
    try {
        await dbConnect()
        
        const cat_id = new Types.ObjectId(paramId)
        let category = await Category.findById(cat_id);

        if (!category) return NextResponse.json({ message: 'Category not found' }, { status: 404 });

        // Make sure user owns the category
        if (category.user.toString() !== userId) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        category = await Category.findByIdAndUpdate(
            cat_id,
            { $set: { name, description, dateCreated, dateUpdated, color, icon } },
            { new: true }
        );

        return NextResponse.json(category, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}; 

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req: NextRequest, paramId: string, userId: string) => {
    try {
        await dbConnect()

        const cat_id = new Types.ObjectId(paramId)

        let category = await Category.findById(cat_id);
        
        if (!category) return NextResponse.json({ message: 'Category not found' }, { status: 404 });

        // Make sure user owns the category
        if (category.user.toString() !== userId) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        await Category.findByIdAndDelete(cat_id);

        return NextResponse.json({ message: 'Category removed' }, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};