'use client'

import { AdvancedTextbox } from "@/components/AdvancedTextbox";
import SnippetCard from "@/components/SnippetCard";
import { deleteCategory, updateCategory } from "@/lib/features/CategoriesSlice";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { Category, Snippet } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CategoryDetails: React.FC<{ category: Category; snippets: Snippet[] }> = ({ category, snippets }) => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState<string>(category.description || '');
    const [color, setColor] = useState(category.color)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            dispatch(updateCategory({ 
                id: category.id, 
                name: name.trim(), 
                description: description.trim(),
                color: color.trim(),
                dateCreated: category.dateCreated,
                dateUpdated: new Date().toISOString()
            }))
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        setName(category.name);
        setDescription(category.description || '');
        setIsEditing(false);
    };

    useEffect(() => {
        handleCancel()
    }, [category]);


    const handleDelete = () => {
        const snippetCount = snippets.length;
        const confirmMessage = snippetCount > 0 
            ? `Are you sure you want to delete the category "${category.name}"? This will also leave ${snippetCount} snippets within it without a category.`
            : `Are you sure you want to delete the category "${category.name}"?`;
            
        if (window.confirm(confirmMessage)) {
            dispatch(deleteCategory({id: category.id}))
            router.push('/categories');
        }
    };
    
    if (isEditing) {
        return (
            <form onSubmit={handleSave} className="bg-gray-800/50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Category</h2>
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="cat-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input id="cat-name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    {/* Description */}
                    <div>
                        <label htmlFor="cat-desc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <AdvancedTextbox 
                            id="cat-desc" 
                            value={description} 
                            onChange={(e: any) => setDescription(e.target.value)} 
                            rows={3} 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>
                    {/* Color */}
                    <div className="flex items-center space-x-2 mb-4">
                        <label htmlFor="category-color" className="text-sm text-gray-400">Color:</label>
                        <input
                            id="category-color"
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            className="w-8 h-8 rounded-full border-none focus:outline-none focus:border-1 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={handleCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Save Changes</button>
                </div>
            </form>
        );
    }
    
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                    <p className="text-gray-400 mt-1">{category.description}</p>
                </div>
                 <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => setIsEditing(true)} className="bg-gray-700 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">Edit</button>
                    <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Delete</button>
                </div>
            </div>

            {snippets.length > 0 ? (
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {snippets.map(s => <SnippetCard key={s.id} snippet={s} />)}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">No snippets in this category yet.</p>
            )}
        </div>
    );
};
