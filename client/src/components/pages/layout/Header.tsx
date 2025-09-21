'use client'

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

export const Header = () => {
	const [isSidebarOpen, setSidebarOpen] = useState(false);

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
						<span className="font-bold text-xl">Snippets</span>
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
					{/* New Snippet */}
					<Link href="/snippets/new" className="hidden md:flex items-center bg-indigo-600 hover:bg-indigo-700 rounded-full px-4 py-2 transition-colors">
						<Icon name="plus" />
						<span className="ml-2">New</span>
					</Link>
					{/* User */}
					<button className="p-2 rounded-full hover:bg-gray-700">
						<Icon name="user" />
					</button>
				</div>
			</div>
		</header>
	)
};