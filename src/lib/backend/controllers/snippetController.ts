import { NextRequest, NextResponse } from 'next/server';
import Snippet from '../models/Snippet'
import { SnippetBaseType, Snippet as SnippetType } from '@/types';
import { Types } from 'mongoose';
import { nullCategory } from '@/lib/definitions';

// @desc    Get all snippets for the logged-in user
// @route   GET /api/snippets
export const getSnippets = async (req: NextRequest, userId: string) => {
    try {
        const snippets = await Snippet.find({ user: userId }).sort({ createdAt: -1 });
        return NextResponse.json(snippets, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};

// @desc    Create a new snippet
// @route   POST /api/snippets
export const createSnippet = async (req: NextRequest, userId: string) => {
    let data: SnippetBaseType | SnippetBaseType[] = await req.json();
    if (typeof data !== 'object') data = JSON.parse(data)
    let dataArray = []

    // Make sure the snippet is an array of snippet objects
    if (Array.isArray(data) && data.length > 0) {
        dataArray = data.map((d) => ({
            ...d, 
            // _id: d.id, 
            user: userId,
            categoryId: d.categoryId === null ? nullCategory.id : d.categoryId, 
        }));
    // !isArray check for typescript to stop complaining
    } else if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
        dataArray = [{
            ...data, 
            // _id: data.id, 
            user: userId,
            categoryId: data.categoryId === undefined ? nullCategory.id : data.categoryId, 
        }];
    } else {
        return NextResponse.json({ message: 'Invalid payload type' }, { status: 400 });
    }

    try {
        const snippets = await Snippet.insertMany(dataArray);
        return NextResponse.json(snippets, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
export const updateSnippet = async (req: NextRequest, paramId: string, userId: string) => {
    const { title, categoryId, tags, content }: SnippetBaseType = (await req.json() as SnippetBaseType);

    try {
        const snip_id = new Types.ObjectId(paramId)
        let snippet = await Snippet.findById(snip_id);

        if (!snippet) return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });

        // Make sure user owns the snippet
        if (snippet.user.toString() !== userId) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        snippet = await Snippet.findByIdAndUpdate(
            snip_id,
            { $set: { title, categoryId: categoryId === undefined ? nullCategory.id : categoryId, tags, content } },
            { new: true }
        );

        return NextResponse.json(snippet, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
export const deleteSnippet = async (req: NextRequest, paramId: string, userId: string) => {
    try {
        const snip_id = new Types.ObjectId(paramId)
        let snippet = await Snippet.findById(snip_id);

        if (!snippet) return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });

        // Make sure user owns the snippet
        if (snippet.user.toString() !== userId) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        await Snippet.findByIdAndDelete(snip_id);

        return NextResponse.json({ message: 'Snippet removed' }, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
};