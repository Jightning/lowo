'use client'

import React, { Suspense, use, useState } from 'react';
import { SnippetType, StatusType } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { selectCategories, selectCategoriesStatus } from '@/lib/features/CategoriesSlice';
import { addSnippet, selectSnippetsStatus } from '@/lib/features/SnippetsSlice';
import { AdvancedTextbox } from '@/components/AdvancedTextbox';
import mongoose from 'mongoose';
import { nullCategory } from '@/lib/definitions';

const NewSnippetPage = ({
  	searchParams,
}: {
  	searchParams: Promise<{ q?: string }>
}) => {
	const router = useRouter();

	const params = use(searchParams)
    const selectedText = params.q; 

	const [title, setTitle] = useState('');
	const [content, setContent] = useState(selectedText || '');
	const [categoryId, setCategoryId] = useState(nullCategory.id);
	const [type, setType] = useState<SnippetType>(SnippetType.TEXT);
	const categories = useAppSelector(selectCategories)
	const categoriesStatus = useAppSelector(selectCategoriesStatus)
	const snippetsStatus = useAppSelector(selectSnippetsStatus)
	const dispatch = useAppDispatch()

	// Check if data is still syncing
	const isSyncing = categoriesStatus === StatusType.PENDING || categoriesStatus === StatusType.IDLE || snippetsStatus === StatusType.PENDING || snippetsStatus === StatusType.IDLE
	
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !content || !categoryId) {
			alert('Please fill all fields');
			return;
		}
        const currentDate = new Date()
		dispatch(addSnippet({ 
			id: (new mongoose.Types.ObjectId()).toString(), 
			title, 
			categoryId, 
			dateCreated: currentDate.toISOString(), 
            dateUpdated: currentDate.toISOString(), 
			content: { type, content } 
		}))
		router.push('/');
	};
	
	return (
		<Suspense>
		<div className="max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Add New Snippet</h1>
			<form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg border border-gray-700">
				{/* Title */}
				<div>
					<label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
					<input
						id="title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						required
					/>
				</div>

				{/* Category */}
				<div>
					<label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
					<select
						id="category"
						value={categoryId}
						onChange={e => setCategoryId(e.target.value)}
						className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						required
					>
						<option value="" disabled>Select a category</option>
						{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
					</select>
				</div>
				
				{/* Type */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
					<div className="flex space-x-4">
						<button type="button" onClick={() => setType(SnippetType.TEXT)} className={`px-4 py-2 rounded-md text-sm ${type === "text" ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Text</button>
						<button type="button" onClick={() => setType(SnippetType.CODE)} className={`px-4 py-2 rounded-md text-sm ${type === "code" ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Code</button>
					</div>
				</div>

				{/* Content */}
				<div>
					<label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
					<AdvancedTextbox
						id="content"
						value={content}
						onChange={(e: any) => setContent(e.target.value)}
						rows={10}
						className={`w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${type === "code" ? 'font-mono' : ''}`}
						required
					/>
				</div>

				{/* Actions */}
				<div className="flex justify-end">
					<button 
						type="submit" 
						disabled={isSyncing}
						className={`font-bold py-2 px-6 rounded-md transition-colors ${
							isSyncing 
								? 'bg-gray-500 cursor-not-allowed text-gray-300' 
								: 'bg-indigo-600 hover:bg-indigo-700 text-white'
						}`}
					>
						{isSyncing ? 'Syncing...' : 'Save Snippet'}
					</button>
				</div>
			</form>
		</div>
		</Suspense>
	);
};

export default NewSnippetPage;
