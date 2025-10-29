"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Snippet, SnippetType } from '@/types';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectCategories } from '@/lib/features/CategoriesSlice';
import { useSearchParams, useRouter } from 'next/navigation';

import { SingleValue } from 'react-select';
import dynamic from 'next/dynamic';

// TODO - creates a delay, try to find a better alternative
const CustomSelect = dynamic(
    () => import('@/components/ui/Select').then((mod) => mod.CustomSelect),
    { ssr: false }
);
const CustomCreatableSelect = dynamic(
    () => import('@/components/ui/Select').then((mod) => mod.CustomCreatableSelect),
    { ssr: false }
);

// // Disabled SSR to fix hydration issue (TODO component has to wait to render, find another fix for hydration issues)
// const CustomCreatableSelect = dynamic(() => import('react-select/creatable'), {
//     ssr: false,
//     loading: () => <div style={{ minHeight: '2.5rem' }} />,
// });

export const SnippetsFilter = () => {
    const categories = useAppSelector(selectCategories)

    const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }))
    // TODO types for this -> also apply in the custom select
    const sortByOptions = [
        { value: 'newf', label: 'Newest First' },
        { value: 'oldf', label: 'Oldest First' },
        { value: 'cataz', label: 'Category (A-Z)' },
    ];

    const [sortBy, setSortBy] = useState('newf');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<SnippetType[]>([SnippetType.CODE, SnippetType.TEXT]);

    const searchParams = useSearchParams()
    const router = useRouter()
    const didInitFromUrl = useRef(false)    
    

    const handleSortByChange = (newSortBy: SingleValue<{ value: string; label: string }>) => {
        if (!newSortBy) return;
        setSortBy(newSortBy.value);
    };

    const handleCategoryFilterChange = (newCategory: SingleValue<{ value: string; label: string }>) => {
        const values = Array.isArray(newCategory) ? newCategory.map((v: any) => v.value) : []
        setSelectedCategories(values)
    };

    const handleTypeChange = (type: Snippet["content"]['type']) => {
        setSelectedTypes(prev => (
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        ));
    };

    // initialize filter state from URL once
    useEffect(() => {
        if (didInitFromUrl.current) return;
        didInitFromUrl.current = true;

        const typesStr = searchParams.get('types') ?? '';
        const catsStr = searchParams.get('category') ?? '';
        const sortStr = searchParams.get('sort') ?? '';

        if (sortStr) setSortBy(sortStr);
        if (catsStr) setSelectedCategories(catsStr.split(',').filter(Boolean));
        if (typesStr) setSelectedTypes(typesStr.split(',').filter(Boolean) as SnippetType[]);
    }, []);

    // sync filter with URL params -> better like this than updating on every change (which causes too many updates and creates errors)
    useEffect(() => {
        const nextTypes = selectedTypes.join(',');
        const nextCats = selectedCategories.join(',');
        const nextSort = sortBy;

        const currTypes = searchParams.get('types') ?? '';
        const currCats = searchParams.get('category') ?? '';
        const currSort = searchParams.get('sort') ?? '';

        if (currTypes === nextTypes && currCats === nextCats && currSort === nextSort) return;

        const params = new URLSearchParams(searchParams?.toString());
        const setOrDelete = (key: string, value: string) => {
            if (!value) params.delete(key); else params.set(key, value);
        };
        setOrDelete('types', nextTypes);
        setOrDelete('category', nextCats);
        setOrDelete('sort', nextSort);

        const query = params.toString();
        router.replace(`/snippets${query ? `?${query}` : ''}`, { scroll: false });
    }, [selectedTypes, selectedCategories, sortBy, searchParams, router]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            {/* Sorting Style Selection */}
            <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-400 mb-2">Sort by</label>
                <CustomSelect
                    value={sortByOptions.find(o => o.value === sortBy)}
                    onChange={handleSortByChange}
                    options={sortByOptions}
                />
            </div>

            {/* Filter by Category */}
            <div className="overflow-visible">
                <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Category</label>
                {/* TODO make it so that if the user inputs something that isn't an actual category it gets added as a partial that can then be used to filter categories (like a search) */}
                <CustomCreatableSelect
                    options={categoryOptions}
                    value={categoryOptions.filter(o => selectedCategories.includes(o.value))}
                    onChange={handleCategoryFilterChange}
                    placeholder="Select or create categories..."
                />
            </div>

            {/* Filter by Type */}
            <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by Type</h3>
                <div className="space-y-2">
                    {/* Code Type Selection */}
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

                    {/* Text Type Selection */}
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
