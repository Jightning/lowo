'use client'

import React, { useEffect } from 'react';
import SnippetCard from '@/components/SnippetCard';
import SnippetCardSkeleton from '@/components/SnippetCardSkeleton';
import CategorySkeleton from '@/components/CategorySkeleton';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectSnippets, selectSnippetsStatus } from '@/lib/features/SnippetsSlice';
import { selectCategories, selectCategoriesStatus } from '@/lib/features/CategoriesSlice';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
	const snippets = useAppSelector(selectSnippets);
	const categories = useAppSelector(selectCategories);
	const snippetsStatus = useAppSelector(selectSnippetsStatus);
	const categoriesStatus = useAppSelector(selectCategoriesStatus);

	const recentSnippets = [...snippets].sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()).slice(0, 4);
	const displayedCategories = [...categories].sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()).slice(0, 5);
	
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold mb-4">Recent Snippets</h1>
				{snippetsStatus === 'pending' || snippetsStatus === 'idle' ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
						{Array.from({ length: 2 }).map((_, index) => (
							<SnippetCardSkeleton key={index} />
						))}
					</div>
				) : recentSnippets.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
						{recentSnippets.map(snippet => (
							<SnippetCard key={snippet.id} snippet={snippet} />
						))}
					</div>
				) : (
					<div className="text-center py-10 bg-gray-800 rounded-lg">
						<p className="text-gray-400">No recent snippets. <Link href="/snippets/new" className="text-indigo-400 hover:underline">Add one!</Link></p>
					</div>
				)}
			</div>
			
			<div>
				<h1 className="text-2xl font-bold mb-4">Categories</h1>
				{categoriesStatus === 'pending' || categoriesStatus === 'idle' ? (
					<div className="flex flex-wrap gap-4">
						{Array.from({ length: 3 }).map((_, index) => (
							<CategorySkeleton key={index} />
						))}
					</div>
				) : displayedCategories.length > 0 ? (
					<div className="flex flex-wrap gap-4">
						{displayedCategories.map(category => (
							<Link key={category.id} href={`/categories?id=${category.id}`} className="block bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 p-4 rounded-lg transition-colors">
								<h3 className="font-semibold text-white">{category.name}</h3>
								<p className="text-sm text-gray-400 mt-1">{snippets.filter(s => s.categoryId === category.id).length} snippets</p>
							</Link>
						))}
						<Link href="/categories" className="bg-gray-800/50 hover:bg-gray-700 border border-dashed border-gray-600 hover:border-indigo-500 p-4 rounded-lg transition-colors flex items-center justify-center">
							<span className="font-semibold text-gray-400">View All...</span>
						</Link>
					</div>
				) : (
					<div className="text-center py-10 bg-gray-800 rounded-lg">
						<p className="text-gray-400">No categories found.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
