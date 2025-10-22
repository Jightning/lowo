'use client'

import React, { useState, useEffect } from 'react';
import { SnippetType } from '@/types';
import Icon from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { selectCategories } from '@/lib/features/CategoriesSlice';
import { addSnippet } from '@/lib/features/SnippetsSlice';


interface CreateSnippetModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialContent: string;
    initialTitle?: string;
}

export const CreateSnippetModal: React.FC<CreateSnippetModalProps> = ({ isOpen, onClose, initialContent, initialTitle = '' }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [categoryId, setCategoryId] = useState('');
    const [type, setType] = useState<SnippetType>(SnippetType.TEXT);
    const categories = useAppSelector(selectCategories)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setContent(initialContent);
            // Set a default category if none is selected
            if (!categoryId && categories.length > 0) {
                setCategoryId(categories[0].id);
            }
        }
    }, [isOpen, initialTitle, initialContent, categoryId, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !categoryId) {
            alert('Please fill all fields');
            return;
        }

        dispatch(addSnippet({ 
			title, 
			categoryId, 
			dateCreated: (new Date()).toISOString(), 
            dateUpdated: (new Date()).toISOString(), 
			content: { type, content } 
		}))
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 w-full max-w-2xl shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create New Snippet</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon name="close" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="modal-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input id="modal-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>

                    <div>
                        <label htmlFor="modal-category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select id="modal-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required >
                            <option value="" disabled>Select a category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                        <div className="flex space-x-4">
                            <button type="button" onClick={() => setType(SnippetType.TEXT)} className={`px-4 py-2 rounded-md text-sm ${type === SnippetType.TEXT ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Text</button>
                            <button type="button" onClick={() => setType(SnippetType.CODE)} className={`px-4 py-2 rounded-md text-sm ${type === SnippetType.CODE ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Code</button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="modal-content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                        <textarea id="modal-content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} className={`w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${type === SnippetType.CODE ? 'font-mono' : ''}`} required />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Save Snippet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

