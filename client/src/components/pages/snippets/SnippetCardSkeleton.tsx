'use client'

import React from 'react';

const SnippetCardSkeleton: React.FC = () => {
	return (
		<div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col h-full animate-pulse">
			<div className="flex-1">
				{/* Header skeleton */}
				<div className="flex justify-between items-start mb-2">
					<div className="h-6 bg-gray-700 rounded w-3/4"></div>
					<div className="h-6 bg-gray-700 rounded-full w-16"></div>
				</div>
				
				{/* Content skeleton */}
				<div className="mt-2">
					<div className="p-3 rounded-md bg-gray-900/50">
						<div className="space-y-2">
							<div className="h-4 bg-gray-700 rounded w-full"></div>
							<div className="h-4 bg-gray-700 rounded w-5/6"></div>
							<div className="h-4 bg-gray-700 rounded w-4/6"></div>
						</div>
					</div>
				</div>
			</div>
			
			<div className="mt-4 flex justify-between items-center">
				{/* Type skeleton */}
				<div className="flex items-center">
					<div className="h-4 w-4 bg-gray-700 rounded"></div>
					<div className="h-4 bg-gray-700 rounded w-8 ml-2"></div>
				</div>
				{/* Button skeleton */}
				<div className="h-8 bg-gray-700 rounded-md w-16"></div>
			</div>
		</div>
	);
};

export default SnippetCardSkeleton;
