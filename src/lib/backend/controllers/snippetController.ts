import { NextRequest, NextResponse } from 'next/server';
import Snippet from '../models/Snippet'
import { Snippet as SnippetType } from '@/types';

// @desc    Get all snippets for the logged-in user
// @route   GET /api/snippets
export const getSnippets = async (req: NextRequest, userId: string) => {
    try {
        const snippets = await Snippet.find({ user: userId }).sort({ createdAt: -1 });
        return NextResponse.json(snippets, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};

// @desc    Create a new snippet
// @route   POST /api/snippets
export const createSnippet = async (req: NextRequest, userId: string) => {
    const { id, title, dateCreated, dateUpdated, categoryId, tags, content }: SnippetType = (await req.json() as SnippetType);

    try {
        const newSnippet = new Snippet({
            user: userId,
            id,
            title,
            dateCreated,
            dateUpdated,
            categoryId,
            tags,
            content,
        });

        const snippet = await newSnippet.save();
        return NextResponse.json(snippet, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
export const updateSnippet = async (req: NextRequest, paramId: string, userId: string) => {
    const { id, title, dateCreated, dateUpdated, categoryId, tags, content }: SnippetType = (await req.json() as SnippetType);

    try {
        let snippet = await Snippet.findById(paramId);

        if (!snippet) return NextResponse.json({ msg: 'Snippet not found' }, { status: 404 });

        // Make sure user owns the snippet
        if (snippet.user.toString() !== userId) {
            return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });
        }

        snippet = await Snippet.findByIdAndUpdate(
            paramId,
            { $set: { id, title, dateCreated, dateUpdated, categoryId, tags, content } },
            { new: true }
        );

        return NextResponse.json(snippet, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
export const deleteSnippet = async (req: NextRequest, paramId: string, userId: string) => {
    try {
        let snippet = await Snippet.findById(paramId);

        if (!snippet) return NextResponse.json({ msg: 'Snippet not found' }, { status: 404 });

        // Make sure user owns the snippet
        if (snippet.user.toString() !== userId) {
            return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });
        }

        await Snippet.findByIdAndDelete(paramId);

        return NextResponse.json({ msg: 'Snippet removed' }, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};