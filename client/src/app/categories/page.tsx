'use client'

import React, { useEffect } from 'react';
import { Category, Snippet } from '@/types';
import { NewCategoryForm } from '@/components/pages/categories/NewCategoryForm';
import { CategoryDetails } from '@/components/pages/categories/CategoryDetails';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { addCategory, selectCategories, selectCategoriesStatus } from '@/lib/features/CategoriesSlice';
import { selectSnippets } from '@/lib/features/SnippetsSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';


const CategoriesPage: React.FC = () => {
	const categories = useAppSelector(selectCategories)
	const snippets = useAppSelector(selectSnippets)
	const categoriesStatus = useAppSelector(selectCategoriesStatus)
	const dispatch = useAppDispatch()

	const router = useRouter();
  	const searchParams = useSearchParams();
	const selectedCategoryId = searchParams.get('id')
	
	useEffect(() => {
		if (!selectedCategoryId && categories.length > 0) {
			const newParams = new URLSearchParams(searchParams.toString());
			newParams.set('id', categories[0].id);
		}
	}, [selectedCategoryId, categories]);
	
	const selectedCategory = categories.find((c: Category) => c.id === selectedCategoryId);
	const snippetsForCategory = selectedCategory ? snippets.filter((s: Snippet) => s.categoryId === selectedCategory.id) : [];
	
	const handleSelectCategory = (id: string) => {
		router.push(`/categories?id=${id}`);
	};
	
	const handleAddCategory = (name: string, description: string, color: string) => {
		dispatch(addCategory({ 
			name, 
			description,
			color,
			id: uuidv4(),
			dateCreated: new Date().toISOString(),
			dateUpdated: new Date().toISOString()
		}))
	};
	
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
			<div className="md:col-span-1 lg:col-span-1 bg-gray-800 p-4 rounded-lg flex flex-col">
				<h1 className="text-xl font-bold mb-4 px-1">Categories</h1>
				<div className="flex-1 space-y-2 overflow-y-auto">
					{categoriesStatus === 'pending' || categoriesStatus === 'idle' ? (
						<div className="space-y-2">
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="h-10 bg-gray-700 rounded w-full"></div>
								</div>
							))}
						</div>
					) : (
						categories.map((cat: Category) => (
							<button key={cat.id} onClick={() => handleSelectCategory(cat.id)} className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategoryId === cat.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}>
								{cat.name}
							</button>
						))
					)}
				</div>
				<div className="mt-4 border-t border-gray-700 pt-4">
					{/* FIX: The `onAdd` prop expects `(name, description)` but `addCategory` from context expects `({name, description})`. This handler adapts the call. */}
					<NewCategoryForm onAdd={handleAddCategory} />
				</div>
			</div>
			<div className="md:col-span-2 lg:col-span-3">
				{categoriesStatus === 'pending' || categoriesStatus === 'idle' ? (
					<div className="animate-pulse">
						<div className="bg-gray-800/50 rounded-lg p-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<div className="h-4 bg-gray-700 rounded w-full"></div>
									<div className="h-4 bg-gray-700 rounded w-3/4"></div>
									<div className="h-4 bg-gray-700 rounded w-1/2"></div>
								</div>
							</div>
						</div>
					</div>
				) : selectedCategory ? (
					<CategoryDetails category={selectedCategory} snippets={snippetsForCategory} />
				) : (
					<div className="text-center p-10 bg-gray-800/50 rounded-lg">
						<h2 className="text-xl font-semibold">Select a category</h2>
						<p className="text-gray-400 mt-2">Choose a category from the left to view its snippets, or add a new one.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CategoriesPage;