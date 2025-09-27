import React from 'react';
import { DrawType } from '../types';
import { NumberIcon, UserGroupIcon, UsersIcon, ClockIcon, CogIcon } from './Icons';

interface SidebarProps {
    currentView: DrawType;
    setCurrentView: (view: DrawType) => void;
}

const navItems = [
    { type: DrawType.NUMBERS, icon: NumberIcon, label: 'Sorteio de Números' },
    { type: DrawType.NAMES, icon: UsersIcon, label: 'Sorteio de Nomes' },
    { type: DrawType.GROUPS, icon: UserGroupIcon, label: 'Sorteio de Grupos' },
    { type: DrawType.HISTORY, icon: ClockIcon, label: 'Histórico' },
    { type: DrawType.SETTINGS, icon: CogIcon, label: 'Minha Conta' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
    return (
        <aside className="w-full lg:w-64 bg-light-card dark:bg-dark-card/50 p-4 lg:p-0 lg:pt-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-dark-border shrink-0">
            <nav className="lg:px-4">
                <ul className="flex flex-row lg:flex-col gap-1">
                    {navItems.map(item => (
                        <li key={item.type} className="flex-1">
                            <button
                                onClick={() => setCurrentView(item.type)}
                                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg text-left transition-all duration-200 font-semibold relative overflow-hidden group active:scale-[0.98] ${
                                    currentView === item.type
                                        ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary dark:text-primary-light'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                }`}
                            >
                                {currentView === item.type && (
                                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full"></span>
                                )}
                                <item.icon className="w-5 h-5 shrink-0" />
                                <span className="hidden md:inline">{item.type}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};