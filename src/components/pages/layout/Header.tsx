'use client'

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { FormEvent, useState } from "react";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectIsAuthenticated, selectUser, selectUserStatus, setIsAuthenticated } from "@/lib/features/UserSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StatusType } from "@/types";

export const Header = () => {
	const router = useRouter()
    const searchParams = useSearchParams()
	const pathname = usePathname()

	const user = useAppSelector(selectUser)
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const userStatus = useAppSelector(selectUserStatus)

	const [isSidebarOpen, setSidebarOpen] = useState(false);
	// If there's already a search query, on refresh it gets displayed in the search bar
	const [search, setSearch] = useState(pathname == '/snippets' ? searchParams.get('q') ?? "" : "");
	
	// So if the user is selecting some text, that text is auto placed in
	const handleNewSnippetsClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault(); 

        const selection = window.getSelection();
        let selectedText = '';

        if (selection) {
            selectedText = selection.toString().trim();
        }

		if (!selectedText && navigator.clipboard && navigator.clipboard.readText) {
            try {
                const clipboardText = await navigator.clipboard.readText();
                selectedText = clipboardText.trim();
            } catch (err) {}
        }

        let destinationUrl = '/snippets/new';
		let params = '';

		// Updating text param (q)
        if (selectedText) {
            const queryParam = encodeURIComponent(selectedText);
            
            params += `${selectedText.length > 400 ? '' : `q=${queryParam}`}`; 
        }

		// Updating category param (catId)
		const idParam = searchParams.get('id');
		if (pathname === '/categories' && idParam) {
			params += `&catId=${idParam}`;
		}

		router.replace(`${destinationUrl}${params ? `?${params}` : ''}`);
    };
	
	// Route to the all snippets page with the search query
	const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const q = search.trim();
		// Append query parameter
		const params = new URLSearchParams(searchParams?.toString());
		params.set('q', q);
		const query = params.toString();
		router.push(`/snippets${query ? `?${query}` : ''}`);
	};

	return (
		<header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-700">
			<Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
			
			<div className="mx-auto px-4 sm:px-6 h-16 flex w-full items-center justify-between">
				<div className="flex items-center">
					{/* Menu */}
					<button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white mr-3">
						<Icon name="menu" />
					</button>

					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Icon name="code" />
						<span className="font-bold text-xl">LoWo</span>
					</Link>

				</div>

				{/* Search Feature */}
				<div className="flex-1 max-w-md mx-4 hidden md:block">
					<form className="relative" onSubmit={handleSearchSubmit} role="search" aria-label="Search snippets">
						<input
							type="search"
							placeholder="Search snippets..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full bg-gray-700 border border-gray-600 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Icon name="question" />
						</div>
					</form>
				</div>

				<div className="flex items-center space-x-4">
					{/* New Snippet - Only show if authenticated */}
					<a 
						href={'/snippets/new'} 
						onClick={handleNewSnippetsClick} 
						className="cursor-pointer md:flex items-center bg-indigo-600 hover:bg-indigo-700 rounded-full px-4 py-2 transition-colors"
					>
       				    <Icon name="plus" />
					   	<span className="md:ml-2 sr-only md:not-sr-only">New</span>
       				</a>

					{/* User */}
					{!isAuthenticated && (userStatus === StatusType.PENDING || userStatus === StatusType.IDLE) ? (
					    // Skeleton View when loading
					    <div className="flex items-center space-x-2 animate-pulse">
					        <div className="h-8 w-8 bg-gray-700 rounded-full"></div> 
					        <div className="hidden md:block h-8 w-20 bg-gray-700 rounded-full"></div>
					    </div>
					) : isAuthenticated && user ? (
					    // Authenticated View
					    <Link href="/profile" className="p-2 rounded-full hover:bg-gray-700 transition-colors">
					        <Icon name="user" />
					    </Link>
					) : (
					    // Unauthenticated View
					    <Link 
					        href={pathname === "/signup" ? 'signin' : 'signup'} 
					        className="hidden md:flex items-center p-2 hover:bg-gray-700 rounded-full px-4 py-2 transition-colors"
					    >
					        <Icon name="user" />
					        <span className="ml-2">{pathname === "/signup" ? 'Sign In' : 'Sign Up'}</span>
					    </Link>
					)}
				</div>
			</div>
		</header>
	)
};