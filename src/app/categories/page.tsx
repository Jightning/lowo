"use client"

import React from 'react';
import { Category, Snippet, StatusType } from '@/types';
import { NewCategoryForm } from '@/components/pages/categories/NewCategoryForm';
import { CategoryDetails } from '@/components/pages/categories/CategoryDetails';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { createCategory, selectCategories, selectCategoriesStatus } from '@/lib/features/CategoriesSlice';
import { selectSnippets } from '@/lib/features/SnippetsSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CategoriesPage = () => {
	const categories = useAppSelector(selectCategories)
	const snippets = useAppSelector(selectSnippets)
	const categoriesStatus = useAppSelector(selectCategoriesStatus)
	const dispatch = useAppDispatch()

	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedCategoryId = searchParams.get('id') || undefined;

	const selectedCategory = categories.find((c: Category) =>  c.id === selectedCategoryId);
	const snippetsForCategory = selectedCategory ? snippets.filter((s: Snippet) => s.categoryId === selectedCategory.id) : [];

	const handleSelectCategory = (id: string) => {
		router.replace(`/categories?id=${id}`);
	};
	
	const handleAddCategory = (name: string, description: string, color: string) => {
		dispatch(createCategory({ name, description, color }))
	};
	
	return (
		<div className="flex flex-col md:flex-row md:items-start gap-6 h-full">
		    {/* Categories Side Menu */}
		    <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 p-4 rounded-lg flex flex-col">
		        <Link href={"/categories"} className="text-xl font-bold mb-4 px-1">Categories</Link>
		        <div className="flex-1 space-y-2 max-h-96 md:max-h-full overflow-y-auto">
		            {categoriesStatus === StatusType.PENDING || categoriesStatus === StatusType.IDLE ? (
						// Loading
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
		            <NewCategoryForm onAdd={handleAddCategory} />
		        </div>
		    </div>
				
		    {/* Category Main View */}
		    <div className="w-full md:w-2/3 lg:w-3/4 flex-grow">
		        {categoriesStatus === StatusType.PENDING || categoriesStatus === StatusType.IDLE ? (
		            // Category Skeleton When Loading
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
		            // Category Details
		            <CategoryDetails category={selectedCategory} snippets={snippetsForCategory} />
		        ) : (
		            // Category when one is not selected
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