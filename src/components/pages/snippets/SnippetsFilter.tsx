"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Snippet, SnippetType } from '@/types';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectCategories } from '@/lib/features/CategoriesSlice';
import { selectSnippets } from '@/lib/features/SnippetsSlice';
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation';

// Disabled SSR to fix hydration issue (TODO component has to wait to render, find another fix for hydration issues)
const CreatableSelect = dynamic(() => import('react-select/creatable'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '2.5rem' }} />,
});

export const SnippetsFilter = () => {
    const categories = useAppSelector(selectCategories)
    const snippets = useAppSelector(selectSnippets)
    const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }))
    
    const [sortBy, setSortBy] = useState('newf');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<SnippetType[]>([SnippetType.CODE, SnippetType.TEXT]);

    const searchParams = useSearchParams()
    const router = useRouter()
    const didInitFromUrl = useRef(false)    
    
    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const handleCategoryFilterChange = (newCategory: unknown) => {
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
                <select 
                    id="sort-by" 
                    value={sortBy} 
                    onChange={handleSortByChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="newf">Newest First</option>
                    <option value="oldf">Oldest First</option>
                    <option value="cataz">Category (A-Z)</option>
                </select>
            </div>

            {/* Filter by Category */}
            <div className="overflow-visible">
                <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Category</label>
                {/* TODO make it so that if the user inputs something that isn't an actual category it gets added as a partial that can then be used to filter categories (like a search) */}
                <CreatableSelect
                    isMulti
                    isClearable
                    closeMenuOnSelect={false}
                    options={categoryOptions}
                    value={categoryOptions.filter(o => selectedCategories.includes(o.value))}
                    onChange={(newCat) => handleCategoryFilterChange(newCat)}
                    placeholder="Select or create categories..."
                    classNamePrefix="rs"
                    // AI generate temporary styling
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            backgroundColor: '#374151',
                            borderColor: state.isFocused ? '#6366f1' : '#4b5563',
                            boxShadow: state.isFocused ? '0 0 0 2px rgba(99,102,241,0.35)' : 'none',
                            ':hover': { borderColor: state.isFocused ? '#6366f1' : '#6b7280' },
                            minHeight: '2.5rem',
                            borderRadius: '0.5rem',
                        }),
                        valueContainer: (base) => ({ ...base, padding: '0 0.5rem', color: '#e5e7eb' }),
                        input: (base) => ({ ...base, color: '#e5e7eb' }),
                        placeholder: (base) => ({ ...base, color: '#9ca3af' }),
                        singleValue: (base) => ({ ...base, color: '#e5e7eb' }),
                        multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#1f2937',
                            border: '1px solid #6b7280',
                            borderRadius: '5px',
                            overflow: 'hidden',
                        }),
                        multiValueLabel: (base) => ({ ...base, color: '#e5e7eb', padding: '0 8px' }),
                        multiValueRemove: (base) => ({
                            ...base,
                            color: '#9ca3af',
                            ':hover': { backgroundColor: '#4b5563', color: '#e5e7eb' },
                        }),
                        menu: (base) => ({ ...base, backgroundColor: '#1f2937', color: '#e5e7eb', zIndex: 50 }),
                        menuList: (base) => ({ ...base, padding: 4 }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#1f2937' : state.isFocused ? '#374151' : 'transparent',
                            color: '#e5e7eb',
                            borderRadius: '0.375rem', // rounded-md
                            ':active': { backgroundColor: '#374151' },
                        }),
                        dropdownIndicator: (base, state) => ({ ...base, color: state.isFocused ? '#e5e7eb' : '#9ca3af', ':hover': { color: '#e5e7eb' } }),
                        clearIndicator: (base) => ({ ...base, color: '#9ca3af', ':hover': { color: '#e5e7eb' } }),
                        indicatorSeparator: (base) => ({ ...base, backgroundColor: '#4b5563' }),
                    }}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: '#6366f1',
                            primary25: '#374151',
                            primary50: '#4338ca',
                            neutral0: '#374151',
                            neutral80: '#e5e7eb',
                            neutral20: '#4b5563',
                            neutral30: '#4b5563',
                        },
                    })}
                />
                {/* <div className="max-h-24 overflow-y-auto space-y-2 p-1 -m-1">g
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
                </div> */}
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
