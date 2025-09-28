'use client'

import { CreateSnippetModal } from '@/components/pages/snippets/CreateSnippetModal';
import { selectCategories } from '@/lib/features/CategoriesSlice';
import { useAppSelector } from '@/lib/hooks/hooks';
import { suggestSnippetsFromText } from '@/services/gemini';
import { Snippet } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
// import { suggestSnippetsFromText } from '../services/geminiService';
// import { AiSuggestedSnippet } from '@/types';
// import CreateSnippetModal from '@/components/CreateSnippetModal';

export default function Page () {
	const router = useRouter()
	const [fileContent, setFileContent] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [suggestions, setSuggestions] = useState<Partial<Snippet>[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	const [modalState, setModalState] = useState<{ isOpen: boolean; content: string; title?: string }>({
		isOpen: false,
		content: '',
		title: '',
	});
	
	const categories = useAppSelector(selectCategories)
	
	const processFile = useCallback(async (file: File) => {
		if (!file || !file.type.startsWith('text/')) {
			alert("Please upload a valid text file.");
			return;
		}
		
		setFileName(file.name);
		setIsLoading(true);
		setError(null);
		setSuggestions([]);
		
		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = e.target?.result as string;
			setFileContent(text);
			try {
				if (categories.length === 0) {
					setError("You need at least one category to get AI suggestions. Please create one on the Categories page.");
					return;
				}
				const result = await suggestSnippetsFromText(text);
				if (result.text) {
					setSuggestions(JSON.parse(result.text));
				}
			} catch (err) {
				setError('Failed to generate AI suggestions. Please check your API key and try again.');
			} finally {
				setIsLoading(false);
			}
		};
		reader.onerror = () => {
			setError("Failed to read the file.");
			setIsLoading(false);
		}
		reader.readAsText(file);
	}, [categories.length]);
	
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			processFile(file);
		}
	};
	
	const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const file = event.dataTransfer.files?.[0];
		if (file) {
			processFile(file);
		}
	};
	
	const handleContextMenu = (event: React.MouseEvent) => {
		const selectedText = window.getSelection()?.toString().trim();
		if (selectedText) {
			event.preventDefault();
			if (categories.length === 0) {
				alert("Please create a category first before saving a snippet.");
				router.push('/categories');
				return;
			}
			setModalState({ isOpen: true, content: selectedText });
		}
	};
	
	const handleSaveSuggestion = (suggestion: Partial<Snippet>) => {
		if (categories.length === 0) {
			alert("Please create a category first before saving a snippet.");
			router.push('/categories');
			return;
		}
		setModalState({ isOpen: true, content: suggestion.content?.content || '', title: suggestion.title });
	}
	
	if (!fileContent) {
		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Import Data</h1>
				<div className="flex items-center justify-center w-full">
					<label 
						htmlFor="dropzone-file" 
						className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
						onDrop={handleDrop}
						onDragOver={e => e.preventDefault()}
					>
						<div className="flex flex-col items-center justify-center pt-5 pb-6">
							<svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
							</svg>
							<p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
							<p className="text-xs text-gray-500">TXT, MD, JSON, or other text-based files</p>
						</div>
						<input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="text/*,.md,.json" />
					</label>
				</div> 
			</div>
		);
	}
	
	return (
		<>
			<CreateSnippetModal 
				isOpen={modalState.isOpen}
				onClose={() => setModalState({ isOpen: false, content: ''})}
				initialContent={modalState.content}
				initialTitle={modalState.title}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
				{/* Left Column: File Preview */}
				<div className="flex flex-col">
					<div className="mb-4">
						<h1 className="text-2xl font-bold">{fileName}</h1>
						<p className="text-sm text-gray-400">Highlight any text and right-click to create a snippet.</p>
					</div>
					<div className="flex-grow bg-gray-800 p-4 rounded-lg border border-gray-700 overflow-y-auto">
						<pre onContextMenu={handleContextMenu} className="whitespace-pre-wrap break-words text-gray-300 text-sm">
							{fileContent}
						</pre>
					</div>
				</div>

				{/* Right Column: AI Suggestions */}
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold mb-4">AI Suggestions</h2>
					<div className="flex-grow bg-gray-800 p-4 rounded-lg border border-gray-700 overflow-y-auto">
						{isLoading && <div className="flex justify-center items-center h-full"><p>Thinking...</p></div>}
						{error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
						{!isLoading && !error && suggestions.length === 0 && (
							<div className="flex justify-center items-center h-full text-gray-500">
								<p>No suggestions found, or AI is disabled.</p>
							</div>
						)}
						<div className="space-y-4">
						{suggestions.map((s, index) => (
							<div key={index} className="bg-gray-900/50 p-4 rounded-md border border-gray-700">
								<div className="flex justify-between items-start">
									<h3 className="font-bold text-lg mb-2">{s.title}</h3>
									<button onClick={() => handleSaveSuggestion(s)} className="text-sm bg-gray-700 hover:bg-indigo-600 px-3 py-1 rounded-md transition-colors flex-shrink-0">Save</button>
								</div>
								<pre className="whitespace-pre-wrap break-words bg-gray-800 p-3 rounded text-sm font-mono max-h-48 overflow-y-auto"><code>{s.content?.content}</code></pre>
							</div>
						))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};