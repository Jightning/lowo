'use client'

import React, { useEffect, useState } from 'react';
import SnippetCard from '@/components/pages/snippets/SnippetCard';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectSnippets, selectSnippetsStatus } from '@/lib/features/SnippetsSlice';
import { SnippetsFilter } from '@/components/pages/snippets/SnippetsFilter';
import { Snippet, StatusType } from '@/types';
import SnippetCardSkeleton from '@/components/pages/snippets/SnippetCardSkeleton';
import Icon from '@/components/ui/Icon';
import { useRouter, useSearchParams } from 'next/navigation';

const AllSnippetsPage = () => {
	const snippets = useAppSelector(selectSnippets)
	const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>(snippets)

	const status = useAppSelector(selectSnippetsStatus)
	const isLoading = status === StatusType.IDLE || status === StatusType.PENDING

	// Initial load of all snippets
	useEffect(() => {
		setFilteredSnippets(snippets);
	}, [snippets]);

	// Filter snippets by search query
	function filterByParams(query: string, snippets: Snippet[]) {
		const q = query.toLowerCase();

		return snippets.filter(
			snippet =>
				snippet.title.toLowerCase().includes(q) ||
				snippet.content.content.toLowerCase().includes(q) ||
				(snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(q)))
		);
	}

	const params = useSearchParams()
	// Search param
	const q = params.get('q') ?? ''

	// Filtering via the URL Params
	useEffect(() => {
		setFilteredSnippets(filterByParams(q, snippets));
	}, [q, snippets]);

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
