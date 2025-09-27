import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NumberDraw } from './components/NumberDraw';
import { NameDraw } from './components/NameDraw';
import { GroupDraw } from './components/GroupDraw';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { AdPlaceholder } from './components/AdPlaceholder';
import { DrawType, AppContextType } from './types';
import { useDrawHistory } from './hooks/useDrawHistory';
import { useAppearanceSettings } from './hooks/useAppearanceSettings';

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [currentView, setCurrentView] = useState<DrawType>(DrawType.NUMBERS);
    const { history, addDrawToHistory, clearHistory } = useDrawHistory();
    const { exportColorPalette, setExportColorPaletteName } = useAppearanceSettings();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    const appContextValue = useMemo(() => ({
        theme,
        toggleTheme,
        addDrawToHistory,
        history,
        clearHistory,
        exportColorPalette,
        setExportColorPaletteName
    }), [theme, toggleTheme, addDrawToHistory, history, clearHistory, exportColorPalette, setExportColorPaletteName]);

    const renderContent = () => {
        switch (currentView) {
            case DrawType.NUMBERS:
                return <NumberDraw />;
            case DrawType.NAMES:
                return <NameDraw />;
            case DrawType.GROUPS:
                return <GroupDraw />;
            case DrawType.HISTORY:
                return <HistoryView />;
            case DrawType.SETTINGS:
                return <SettingsView />;
            default:
                return <NumberDraw />;
        }
    };

    return (
        <AppContext.Provider value={appContextValue}>
            <div className="flex flex-col min-h-screen bg-light dark:bg-dark text-gray-800 dark:text-dark-text font-sans transition-colors duration-300">
                <Header />
                <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                     <AdPlaceholder location="Topo" size="leaderboard" />
                </div>
                <div className="flex flex-col lg:flex-row flex-1 container mx-auto">
                    <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
                        <div key={currentView} className="w-full animate-fadeIn">
                             {renderContent()}
                        </div>
                    </main>
                    <aside className="w-full lg:w-80 shrink-0 flex flex-col items-center gap-6 p-6">
                        <AdPlaceholder location="Lateral Superior" size="medium-rectangle" />
                        <AdPlaceholder location="Lateral Inferior" size="large-rectangle" />
                    </aside>
                </div>
                <footer className="w-full container mx-auto p-4 sm:px-6 lg:px-8">
                     <AdPlaceholder location="Rodapé" size="banner" />
                </footer>
            </div>
        </AppContext.Provider>
    );
};

export default App;