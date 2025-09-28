'use client'

import React from 'react';

const SnippetDetailSkeleton: React.FC = () => {
	return (
		<div className="max-w-4xl mx-auto animate-pulse">
			{/* Content skeleton */}
			<div className="bg-gray-800 rounded-lg p-6">
				<div className="space-y-4">
					<div className="h-6 bg-gray-700 rounded w-1/4"></div>
					<div className="h-4 bg-gray-700 rounded w-1/6"></div>
					<div className="h-32 bg-gray-700 rounded"></div>
				</div>
			</div>
		</div>
	);
};

export default SnippetDetailSkeleton;
