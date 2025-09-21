import { AdvancedTextbox } from "@/components/AdvancedTextbox";
import { useState } from "react";

export const NewCategoryForm: React.FC<{ onAdd: (name: string, description: string, color: string) => void }> = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('')
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim(), description.trim(), color.trim());
            setName('');
            setDescription('');
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-1">
            <h3 className="font-semibold mb-2">New Category</h3>
            <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Category Name" 
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required 
            />
            <AdvancedTextbox 
                value={description} 
                onChange={(e: any) => setDescription(e.target.value)} 
                placeholder="Description (optional)" 
                rows={2} 
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
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
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-md py-2 transition-colors">Add Category</button>
        </form>
    )
};
