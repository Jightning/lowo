'use client'

import React, { useState, useEffect } from 'react';
import { Snippet, SnippetType, StatusType } from '@/types';
import Icon from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { deleteSnippet, selectSnippets, updateSnippet, selectSnippetsStatus } from '@/lib/features/SnippetsSlice';
import { selectCategories, selectCategoriesStatus } from '@/lib/features/CategoriesSlice';
import { useRouter, useParams  } from 'next/navigation';
import Link from 'next/link';
import { HighlightedCode } from '@/components/HighlightedCode';
import { AdvancedTextbox } from '@/components/AdvancedTextbox';
import SnippetDetailSkeleton from '@/components/pages/snippets/SnippetDetailSkeleton';
import { nullCategory } from '@/lib/definitions';

interface Params {
    id: string;
    [key: string]: string; 
}

const SnippetDetailPage = () => {
    const router = useRouter()
    const params = useParams<Params>()
    const { id } = params

    const snippets = useAppSelector(selectSnippets)
    const categories = useAppSelector(selectCategories)
    const snippetsStatus = useAppSelector(selectSnippetsStatus)
    const categoriesStatus = useAppSelector(selectCategoriesStatus)
    const dispatch = useAppDispatch()

    const [snippet, setSnippet] = useState<Snippet | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    
    // Editable fields state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState(nullCategory.id);
    const [type, setType] = useState<SnippetType>(SnippetType.CODE);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const foundSnippet = snippets.find(s => s.id === id);
        setSnippet(foundSnippet);
        if (foundSnippet) {
            setTitle(foundSnippet.title);
            setContent(foundSnippet.content.content);
            setCategoryId(foundSnippet.categoryId || nullCategory.id);
            setType(foundSnippet.content.type);
        }
    }, [id, snippets]);
    
    const category = categories.find(c => c.id === snippet?.categoryId);

    const handleCopy = () => {
        if (!snippet) return;
        navigator.clipboard.writeText(snippet.content.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = () => {
        if (id && window.confirm('Are you sure you want to delete this snippet?')) {
            dispatch(deleteSnippet({id}))
            router.replace('/snippets');
        }
    };

    const handleSave = () => {
        if (!id || !snippet) return;
        const currentDate = new Date()
        dispatch(updateSnippet({ 
            id: id, 
            title, categoryId,
            dateCreated: snippet.dateCreated,
            dateUpdated: currentDate.toISOString(), 
            content: { type, content } 
        }))
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        if (snippet) {
            setTitle(snippet.title);
            setContent(snippet.content.content);
            setCategoryId(snippet.categoryId || nullCategory.id);
            setType(snippet.content.type);
        }
        setIsEditing(false);
    };

    // Only show skeleton if snippets are still loading
    if (snippetsStatus === StatusType.PENDING || snippetsStatus === StatusType.IDLE) {
        return <SnippetDetailSkeleton />;
    }

    if (!snippet) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">Snippet not found</h1>
                <Link href="/snippets" className="text-indigo-400 hover:underline mt-4 inline-block">Go back to all snippets</Link>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            {!isEditing ? (
                // Regular display of snippet
                <div className="bg-gray-800 rounded-lg border border-gray-700">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                        {/* Title and extra info */}
                        <div>
                            <h1 className="text-3xl font-bold text-white">{snippet.title}</h1>
                            <div className="flex items-center text-sm text-gray-400 mt-2 space-x-4">
                                {/* Categories */}
                                {categoriesStatus === StatusType.PENDING || categoriesStatus === StatusType.IDLE ? (
                                    <div className="animate-pulse">
                                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                                    </div>
                                ) : category ? (
                                    <Link 
                                        href={`/categories?id=${category.id}`} 
                                        className="font-semibold text-gray-300 px-2 border-1 rounded-md"
                                        style={{borderColor: category.color}}>{category.name}
                                    </Link>
                                ) : null}
                                <span className="flex items-center">
                                    {snippet.content.type === 'code' ? <Icon name='code' /> : <Icon name='text' />}
                                    <span className='pl-2'>{snippet.content.type}</span>
                                </span>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex space-x-2">
                            <button onClick={() => setIsEditing(true)} className="bg-gray-700 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">Edit</button>
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Delete</button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex min-w-0">
                            {/* Snippet Content */}
                            <div className="flex-1 min-w-0 ">
                                {snippet.content.type === 'code' ? 
                                    <HighlightedCode background={true} className="overflow-x-auto">
                                        {snippet.content.content}
                                    </HighlightedCode>
                                    :
                                    <div className={`whitespace-pre-wrap text-gray-300 text-md overflow-x-auto p-4 rounded-md ` }>
                                        {snippet.content.content}
                                    </div>
                                }
                            </div>
                            {/* Copy button */}
                            <div className="flex-shrink-0 pl-4">
                                <button onClick={handleCopy} className="flex items-center text-sm bg-gray-700 hover:bg-indigo-600 px-3 py-1 rounded-md transition-colors">
                                    <Icon name="copy" />
                                    <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Editting display of snippet
                <div className="bg-gray-800 p-8 my-4 rounded-lg border border-gray-700">
                    <h1 className="text-3xl font-bold mb-6">Edit Snippet</h1>
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required >
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                            <div className="flex space-x-4">
                                <button type="button" onClick={() => setType(SnippetType.CODE)} className={`px-4 py-2 rounded-md text-sm ${type === 'code' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Code</button>
                                <button type="button" onClick={() => setType(SnippetType.TEXT)} className={`px-4 py-2 rounded-md text-sm ${type === 'text' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Text</button>
                            </div>
                        </div>
                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                            <AdvancedTextbox id="content" value={content} onChange={(e: any) => setContent(e.target.value)} rows={10} className={`w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${type === 'code' ? 'font-mono' : ''}`} required />
                        </div>
                        {/* Actions */}
                        <div className="flex justify-end space-x-4">
                           <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                           <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SnippetDetailPage;