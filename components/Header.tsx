import React, { useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType } from '../types';
import { SunIcon, MoonIcon } from './Icons';

export const Header: React.FC = () => {
    const { theme, toggleTheme } = useContext(AppContext) as AppContextType;

    return (
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-light-card dark:bg-dark-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-20 border-b border-slate-200 dark:border-dark-border">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 text-white bg-gradient-to-br from-primary-light to-accent rounded-full flex items-center justify-center shadow-lg">
                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" fill="currentColor" opacity="0.4"/>
                        <path d="M12 6L10.5 9.5L7 11L10.5 12.5L12 16L13.5 12.5L17 11L13.5 9.5L12 6Z" fill="currentColor"/>
                    </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300">SorteioMaster</h1>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-90"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
            </div>
        </header>
    );
};