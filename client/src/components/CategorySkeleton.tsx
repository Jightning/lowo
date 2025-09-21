'use client'

import React from 'react';

const CategorySkeleton: React.FC = () => {
	return (
		<div className="block bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 p-4 rounded-lg transition-colors animate-pulse w-24">
			<div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
			<div className="h-4 bg-gray-700 rounded w-1/2"></div>
		</div>
	);
};

export default CategorySkeleton;
