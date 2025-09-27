import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 max-w-4xl mx-auto flex flex-col animate-scaleIn border border-slate-200 dark:border-dark-border"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-dark-border">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-3xl w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none">&times;</button>
                </header>
                <main className="p-4 sm:p-6">
                    {children}
                </main>
                <footer className="p-4 bg-slate-50 dark:bg-dark-card/50 border-t border-slate-200 dark:border-dark-border flex justify-end rounded-b-2xl">
                     <button
                        onClick={onClose}
                        className="px-6 py-2 font-semibold rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        Fechar
                    </button>
                </footer>
            </div>
        </div>
    );
};