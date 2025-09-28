import { NextRequest, NextResponse } from 'next/server';
import Category from '../models/Category'
import { Category as CategoryType } from '@/types';

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
export const getCategories = async (req: NextRequest, userId: string) => {
    try {
        const categories = await Category.find({ user: userId }).sort({ name: 1 });
        return NextResponse.json(categories, { status: 200 });
    } catch (err) {
        console.error("Error retrieving categories:", (err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
export const createCategory = async (req: NextRequest, userId: string) => {
    const { id, name, description, dateCreated, dateUpdated, color, icon }: CategoryType = (await req.json() as CategoryType);

    try {
        const newCategory = new Category({
            user: userId,
            id,
            name,
            description,
            dateCreated,
            dateUpdated,
            color,
            icon,
        });

        const category = await newCategory.save();
        return NextResponse.json(category, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
export const updateCategory = async (req: NextRequest, paramId: string, userId: string) => {
    const { id, name, description, dateCreated, dateUpdated, color, icon }: CategoryType = (await req.json() as CategoryType);
        
    try {
        let category = await Category.findById(paramId);

        if (!category) return NextResponse.json({ msg: 'Category not found' }, { status: 404 });

        // Make sure user owns the category
        if (category.user.toString() !== userId) {
            return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });
        }

        category = await Category.findByIdAndUpdate(
            paramId,
            { $set: { id, name, description, dateCreated, dateUpdated, color, icon } },
            { new: true }
        );

        return NextResponse.json(category, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}; 

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req: NextRequest, paramId: string, userId: string) => {
    try {
        let category = await Category.findById(paramId);

        if (!category) return NextResponse.json({ msg: 'Category not found' }, { status: 404 });

        // Make sure user owns the category
        if (category.user.toString() !== userId) {
            return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });
        }

        await Category.findByIdAndDelete(paramId);

        return NextResponse.json({ msg: 'Category removed' }, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};