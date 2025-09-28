'use client'

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { selectIsAuthenticated, selectProfile, setIsAuthenticated } from "@/lib/features/ProfileSlice";
import { getToken } from "@/lib/session";
import { usePathname, useRouter } from "next/navigation";

export const Header = () => {
	const pathname = usePathname()
	const router = useRouter()
	const profile = useAppSelector(selectProfile)
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	const dispatch = useAppDispatch()
	const [isSidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
	    const checkToken = async () => {
	        const token = await getToken(); 
	        dispatch(setIsAuthenticated(!!token));
	    };

	    checkToken();
	}, [dispatch]);

	
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

        if (selectedText) {
            const queryParam = encodeURIComponent(selectedText);
            
            destinationUrl = `/snippets/new${selectedText.length > 400 ? '' : `?q=${queryParam}`}`; 
        }

        router.push(destinationUrl);

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
					<div className="relative">
						<input type="search" placeholder="Search snippets..." className="w-full bg-gray-700 border border-gray-600 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Icon name="question" />
						</div>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					{/* New Snippet - Only show if authenticated */}
					{/* {isAuthenticated && ( */}
					<a 
						href={'/snippets/new'} 
						onClick={handleNewSnippetsClick} 
						className="cursor-pointer md:flex items-center bg-indigo-600 hover:bg-indigo-700 rounded-full px-4 py-2 transition-colors"
					>
       				    <Icon name="plus" />
					   	<span className="md:ml-2 sr-only md:not-sr-only">New</span>
       				</a>
					{/* )} */}
					{/* User/Auth Icon */}
					{isAuthenticated && profile ? (
						<Link href="/profile" className="p-2 rounded-full hover:bg-gray-700 transition-colors">
							<Icon name="user" />
						</Link>
					) : (
						<Link href={pathname === "/signup" ? 'signin' : 'signup'} className="hidden md:flex items-center p-2 hover:bg-gray-700 rounded-full px-4 py-2 transition-colors">
							<Icon name="user" />
							<span className="ml-2">{pathname === "/signup" ? 'Sign In' : 'Sign Up'}</span>
						</Link>
					)}
				</div>
			</div>
		</header>
	)
};