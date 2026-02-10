import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                            <Target className="w-5 h-5" />
                        </div>
                        GrantMatch AI
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link
                            to="/"
                            className={cn("transition-colors hover:text-primary", isActive('/') ? "text-primary" : "text-slate-600")}
                        >
                            Home
                        </Link>
                        <Link
                            to="/profile"
                            className={cn("transition-colors hover:text-primary", isActive('/profile') ? "text-primary" : "text-slate-600")}
                        >
                            Get Matched
                        </Link>
                        <Link
                            to="/results"
                            className={cn("transition-colors hover:text-primary", isActive('/results') ? "text-primary" : "text-slate-600")}
                        >
                            Browse Grants
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/profile">
                            <button className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
                {children}
            </main>

            <footer className="border-t border-slate-200 bg-white py-6 md:py-0">
                <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built for Hackathon MVP via <a href="#" className="font-medium underline underline-offset-4">GrantMatch AI</a>.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>v1.0.0 (MVP)</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
