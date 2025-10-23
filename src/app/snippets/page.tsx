'use client'

import React, { useEffect, useMemo, useState } from 'react';
import SnippetCard from '@/components/pages/snippets/SnippetCard';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectSnippets, selectSnippetsStatus } from '@/lib/features/SnippetsSlice';
import { SnippetsFilter } from '@/components/pages/snippets/SnippetsFilter';
import { Snippet, StatusType } from '@/types';
import SnippetCardSkeleton from '@/components/pages/snippets/SnippetCardSkeleton';
import { useSearchParams } from 'next/navigation';
import { selectCategories } from '@/lib/features/CategoriesSlice';

const AllSnippetsPage = () => {
	const snippets = useAppSelector(selectSnippets)
	const categories = useAppSelector(selectCategories)
	const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>(snippets)

	const status = useAppSelector(selectSnippetsStatus)
	const isLoading = status === StatusType.IDLE || status === StatusType.PENDING

	// Initial load of all snippets
	useEffect(() => {
		setFilteredSnippets(snippets);
	}, [snippets]);

	// Filter + sort snippets by URL params
	function filterByParams(
		query: string,
		sort: string,
		typesStr: string,
		categoriesStr: string,
		source: Snippet[]
	) {
		const q = (query || '').trim().toLowerCase();
		const types = (typesStr || '')
			.split(',')
			.map(s => s.trim().toLowerCase())
			.filter(Boolean);
		const categoryIds = (categoriesStr || '')
			.split(',')
			.map(s => s.trim())
			.filter(Boolean);

		let result = source;

		// Search Filter
		if (q) {
			result = result.filter(snippet =>
				snippet.title.toLowerCase().includes(q) ||
				snippet.content.content.toLowerCase().includes(q) ||
				(snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(q)))
			);
		}

		// Type Filter -> If no type, show all types
		if (types.length > 0) {
			result = result.filter(snippet => types.includes(snippet.content.type));
		}

		// Category Filter
		if (categoryIds.length > 0) {
			result = result.filter(snippet => !!snippet.categoryId && categoryIds.includes(snippet.categoryId));
		}

		// Sorting Filter
		const sorted = [...result];
		switch (sort) {
			case 'newf':
				sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;
			case 'oldf':
				sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
				break;
			case 'cataz': {
				const nameById = new Map(categories.map(c => [c.id, c.name.toLowerCase()]));
				sorted.sort((a, b) => {
					const aName = a.categoryId ? (nameById.get(a.categoryId) || '') : '';
					const bName = b.categoryId ? (nameById.get(b.categoryId) || '') : '';
					if (aName === bName) return a.title.localeCompare(b.title);
					return aName.localeCompare(bName);
				});
				break;
			}
			// TODO This should become relevance sort
			default:
				break;
		}

		return sorted;
	}

	const params = useSearchParams()
	// Params
	const q = params.get('q') ?? '' // search param
	const typesParam = params.get('types') ?? ''
	const categoriesParam = params.get('category') ?? ''
	const sortParam = params.get('sort') ?? ''

	// Filtering via the URL Params
	useEffect(() => {
		setFilteredSnippets(filterByParams(q, sortParam, typesParam, categoriesParam, snippets));
	}, [q, typesParam, categoriesParam, sortParam, snippets, categories]);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">All Snippets</h1>
			<SnippetsFilter />
			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 5 }).map((_, i) => (
						<SnippetCardSkeleton key={i} />
					))}
				</div>
			) : filteredSnippets.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredSnippets.map(snippet => (
						<SnippetCard key={snippet.id} snippet={snippet} />
					))}
				</div>
			) : (
				<div className="text-center py-20 bg-gray-800 rounded-lg">
					<h2 className="text-xl font-semibold">No Snippets Yet</h2>
					<p className="text-gray-400 mt-2">Your snippet collection is empty. Start by adding a new one!</p>
				</div>
			)}
		</div>
	);
};

export default AllSnippetsPage;
