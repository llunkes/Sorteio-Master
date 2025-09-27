import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { AppContextType } from '../types';
import { definedPalettes } from '../hooks/useAppearanceSettings';

const USER_LISTS_KEY = 'sorteioMasterUserLists';

const inputStyles = "flex-grow p-3 border border-slate-300 rounded-lg bg-white dark:bg-slate-800/50 dark:border-dark-border focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-inner-soft text-base";


export const SettingsView: React.FC = () => {
    const { exportColorPalette, setExportColorPaletteName } = useContext(AppContext) as AppContextType;
    const [savedLists, setSavedLists] = useState<Record<string, string[]>>({});
    const [newListName, setNewListName] = useState('');
    const allPalettes = Object.values(definedPalettes);
    
    useEffect(() => {
        const lists = localStorage.getItem(USER_LISTS_KEY);
        if (lists) {
            try {
                setSavedLists(JSON.parse(lists));
            } catch(e) {
                console.error("Failed to parse saved lists:", e);
                localStorage.removeItem(USER_LISTS_KEY);
            }
        }
    }, []);

    const saveLists = () => {
        if (!newListName.trim()) {
            alert('Por favor, dê um nome para sua lista.');
            return;
        }
        // Mock function to save lists with example content
        const updatedLists = {...savedLists, [newListName.trim()]: ['Participante 1', 'Participante 2', 'Participante 3']};
        localStorage.setItem(USER_LISTS_KEY, JSON.stringify(updatedLists));
        setSavedLists(updatedLists);
        setNewListName('');
        alert(`Lista '${newListName.trim()}' salva com sucesso! (simulado)`);
    };
    
    const deleteList = (listName: string) => {
        const {[listName]: deleted, ...remainingLists} = savedLists;
        localStorage.setItem(USER_LISTS_KEY, JSON.stringify(remainingLists));
        setSavedLists(remainingLists);
    }

    return (
        <div className="space-y-8 w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Minha Conta</h2>
            
             <div className="p-6 sm:p-8 bg-light-card dark:bg-dark-card rounded-2xl shadow-card border border-slate-200 dark:border-dark-border">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Personalização da Interface</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">Customize a aparência dos elementos da interface para que se ajustem à sua preferência.</p>
                
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Paleta de Cores para Ícones de Exportação</label>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        {allPalettes.map(palette => (
                            <button
                                key={palette.name}
                                onClick={() => setExportColorPaletteName(palette.name)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all w-full sm:w-auto ${
                                    exportColorPalette.name === palette.name
                                        ? 'border-primary dark:border-primary-light ring-2 ring-primary/50 bg-primary/5 dark:bg-primary-light/10'
                                        : 'border-slate-300 dark:border-dark-border hover:border-primary/70'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold">{palette.name}</span>
                                    <div className="flex gap-1.5">
                                        <span className={`w-4 h-4 rounded-full ${palette.pdf.bg}`}></span>
                                        <span className={`w-4 h-4 rounded-full ${palette.xlsx.bg}`}></span>
                                        <span className={`w-4 h-4 rounded-full ${palette.image.bg}`}></span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8 bg-light-card dark:bg-dark-card rounded-2xl shadow-card border border-slate-200 dark:border-dark-border">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Listas de Participantes Salvas</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">Salve e reutilize suas listas de participantes para sorteios futuros. (Salvo no seu navegador)</p>
                
                {Object.keys(savedLists).length > 0 ? (
                     <ul className="space-y-3 mb-6">
                        {Object.entries(savedLists).map(([name, list]) => (
                            <li key={name} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-dark-border">
                                <div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{name}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400"> ({list.length} participantes)</span>
                                </div>
                                <button onClick={() => deleteList(name)} className="px-3 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md text-sm font-semibold transition-colors">Excluir</button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-slate-500 italic mb-6">Nenhuma lista salva.</p>}

                <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="text" 
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Nome da nova lista"
                        className={inputStyles}
                    />
                    <button onClick={saveLists} className="px-5 py-3 font-semibold rounded-lg bg-secondary text-white hover:bg-secondary-dark transition-colors shrink-0">
                        Salvar Nova Lista (Simulação)
                    </button>
                </div>
            </div>
        </div>
    );
};