
import React, { useState, useMemo } from 'react';
import SnippetCard from '@/components/pages/snippets/SnippetCard';
import { Snippet, SnippetType } from '@/types';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectCategories } from '@/lib/features/CategoriesSlice';
import { selectSnippets } from '@/lib/features/SnippetsSlice';
import { nullCategory } from '@/lib/definitions';

export const SnippetsFilter = ({setFilteredSnippets}: any) => {
    const categories = useAppSelector(selectCategories)
    const snippets = useAppSelector(selectSnippets)
    
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<SnippetType[]>([SnippetType.CODE, SnippetType.TEXT]);
    
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
            ? prev.filter(id => id !== categoryId)
            : [...prev, categoryId]
        );
    };
    
    const handleTypeChange = (type: Snippet["content"]['type']) => {
        setSelectedTypes(prev =>
            prev.includes(type)
            ? prev.filter(t => t !== type)
            : [...prev, type]
        );
    };
    
    // const filteredAndSortedSnippets = useMemo(() => {
    //     const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name.toLowerCase() || '';
    //     // TODO figure out for nullCategory
    //     const sortedResult = 
    //     [...snippets]
    //         .filter(snippet => selectedTypes.includes(snippet.content.type))
    //         .filter(snippet => selectedCategories.length === 0 || selectedCategories.includes(snippet.categoryId || nullCategory.id))
    //         .sort((a, b) => {
    //             switch (sortBy) {
    //                 case 'oldest':
    //                 return new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime();
    //                 case 'category':
    //                 return getCategoryName(a.categoryId || nullCategory.id).localeCompare(getCategoryName(b.categoryId || nullCategory.id));
    //                 case 'newest':
    //                 default:
    //                 return new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime();
    //             }
    //         });

    //     setFilteredSnippets(sortedResult)
        
    //     return sortedResult;
    // }, [snippets, categories, sortBy, selectedCategories, selectedTypes]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-400 mb-2">Sort by</label>
                <select 
                    id="sort-by" 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="category">Category (A-Z)</option>
                </select>
            </div>
            
            <div className="overflow-hidden">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by Category</h3>
                <div className="max-h-24 overflow-y-auto space-y-2 p-1 -m-1">
                    {categories.length > 0 ? categories.map(cat => (
                        <div key={cat.id} className="flex items-center">
                            <input 
                                type="checkbox" 
                                id={`cat-${cat.id}`} 
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => handleCategoryChange(cat.id)}
                                className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`cat-${cat.id}`} className="ml-2 text-sm text-gray-300 select-none cursor-pointer">{cat.name}</label>
                        </div>
                    )) : <p className="text-sm text-gray-500">No categories found.</p>}
                </div>
            </div>
                
            <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by Type</h3>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="type-code" 
                            checked={selectedTypes.includes(SnippetType.CODE)}
                            onChange={() => handleTypeChange(SnippetType.CODE)}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor="type-code" className="ml-2 text-sm text-gray-300 select-none cursor-pointer">Code</label>
                    </div>
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="type-text" 
                            checked={selectedTypes.includes(SnippetType.TEXT)}
                            onChange={() => handleTypeChange(SnippetType.TEXT)}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor="type-text" className="ml-2 text-sm text-gray-300 select-none cursor-pointer">Text</label>
                    </div>
                </div>
            </div>
        </div>
    );
};
