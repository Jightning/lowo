import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { useEffect, useRef } from 'react';

export const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const NavItem = ({ to, children }: { to: string, children: React.ReactNode }) => (
        <Link 
            href={to} 
            onClick={onClose} 
            className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
            {children}
        </Link>
    );

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
    }

    const sidebarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!isOpen) return;
            const target = e.target as Node | null;
            if (sidebarRef.current && target && !sidebarRef.current.contains(target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 flex z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Sidebar panel */}
            <div
                ref={sidebarRef}
                onClick={handleClick}
                className={`z-50 fixed top-0 left-0 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-out h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Close button */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                    <Link draggable={false} href="/" className="font-bold text-xl">Menu</Link>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon name="close" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="p-4 space-y-2 bg-inherit">
                   <NavItem to="/"><Icon name="dashboard" /><span className="pl-2">Dashboard</span></NavItem>
                   <NavItem to="/snippets"><Icon name="filterNone" /><span className="pl-2">All Snippets</span></NavItem>
                   <NavItem to="/categories"><Icon name="categories" /><span className="pl-2">Categories</span></NavItem>
                   <NavItem to="/import"><Icon name="download" /><span className="pl-2">Import Data</span></NavItem>
                </nav>
            </div>
        </div>
    );
};