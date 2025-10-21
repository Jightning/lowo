'use client'

import React, { useState } from 'react';
import { Snippet, Category } from '../../../types';
import Icon from '../../ui/Icon';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectCategories } from '@/lib/features/CategoriesSlice';
import { HighlightedCode } from '../../HighlightedCode';

interface SnippetCardProps {
	snippet: Snippet;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
	const categories = useAppSelector(selectCategories)

	const [copied, setCopied] = useState(false);
	
	const category = categories.find(c => c.id === snippet.categoryId);
	
	const handleCopy = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		navigator.clipboard.writeText(snippet.content.content);
		setCopied(true);
		setTimeout(() => setCopied(false), 500);
	};
	 
	return (
		<Link href={`/snippets/${snippet.id}`} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col h-full hover:border-indigo-500 transition-colors" draggable={false}>
			<div className="flex-1">
				{/* Header */}
				<div className="flex justify-between items-start mb-2">
					<h3 className="font-bold text-lg text-white">{snippet.title}</h3>
					{category && <span className={`text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full border-1`} style={{borderColor: category.color}}>{category.name}</span>}
				</div>
				{/* Snippet content - clamp to 3 lines */}
				<div className="mt-2 text-sm">
					{snippet.content.type === "code" ? (
						<div className="overflow-hidden relative" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
							<HighlightedCode clampLines={3}>
								{snippet.content.content}
							</HighlightedCode>
							<div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none bg-gradient-to-t from-gray-800 to-transparent" />
						</div>
					) : (
						<div className="p-3 rounded-md bg-gray-900/50 overflow-hidden relative" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
							<pre className="whitespace-pre-wrap break-words text-gray-300 m-0">
								<code>{snippet.content.content}</code>
							</pre>
							<div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none bg-gradient-to-t from-gray-800 to-transparent" />
						</div>
					)}
				</div>
			</div>
			
			<div className="mt-4 flex justify-between items-center">
				{/* Snippet type */}
				<div className="flex items-center text-gray-400">
					{snippet.content.type === "code" ? <Icon name="code" /> : <Icon name="text" />}
					<span className="pl-1 text-md">{snippet.content.type}</span>
				</div>
				{/* Copy button */}
				<button onClick={handleCopy} className="flex items-center text-sm bg-gray-700 hover:bg-indigo-600 px-3 py-1 rounded-md transition-colors">
					<Icon name="copy" />
					<span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
				</button>
			</div>
		</Link>
	);
};

export default SnippetCard;