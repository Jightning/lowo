'use client'

import React, { useState } from 'react';
import SnippetCard from '@/components/pages/snippets/SnippetCard';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectSnippets } from '@/lib/features/SnippetsSlice';
import { SnippetsFilter } from '@/components/pages/snippets/SnippetsFilter';
import { Snippet } from '@/types';

const AllSnippetsPage: React.FC = () => {
	const snippets = useAppSelector(selectSnippets)
	const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>(snippets)

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">All Snippets</h1>
			<SnippetsFilter setFilteredSnippets={setFilteredSnippets} />
			{filteredSnippets.length > 0 ? (
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
