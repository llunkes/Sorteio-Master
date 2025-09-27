import React, { useState, useContext, useCallback } from 'react';
import { AppContext } from '../App';
import { AppContextType, DrawType } from '../types';
import { Modal } from './Modal';
import { extractNamesFromText, isAIAvailable } from '../services/geminiService';
import { SparklesIcon } from './Icons';

const inputStyles = "w-full p-3 border border-slate-300 rounded-lg bg-white dark:bg-slate-800/50 dark:border-dark-border focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-inner-soft text-base";
const labelStyles = "block text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300";

export const NameDraw: React.FC = () => {
    const { addDrawToHistory } = useContext(AppContext) as AppContextType;
    const [names, setNames] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('1');
    const [removeDrawn, setRemoveDrawn] = useState<boolean>(true);
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [aiLoading, setAiLoading] = useState<boolean>(false);

    const handleDraw = useCallback(() => {
        setError('');
        const participants = names.split('\n').map(n => n.trim()).filter(Boolean);
        const qtyNum = parseInt(quantity, 10);

        if (participants.length < 2) {
            setError('Por favor, insira pelo menos dois nomes.');
            return;
        }
        if (isNaN(qtyNum) || qtyNum <= 0) {
            setError('A quantidade deve ser maior que zero.');
            return;
        }
        if (qtyNum > participants.length) {
            setError('A quantidade a sortear não pode ser maior que o número de participantes.');
            return;
        }

        const availableNames = [...participants];
        const drawnNames: string[] = [];
        for (let i = 0; i < qtyNum; i++) {
            const randomIndex = Math.floor(Math.random() * availableNames.length);
            drawnNames.push(availableNames.splice(randomIndex, 1)[0]);
        }
        
        if (removeDrawn) {
            setNames(availableNames.join('\n'));
        }

        setResults(drawnNames);
        addDrawToHistory({
            type: DrawType.NAMES,
            results: drawnNames,
            config: { quantity: qtyNum, removeDrawn, initialCount: participants.length }
        });
        setIsModalOpen(true);
    }, [names, quantity, removeDrawn, addDrawToHistory]);
    
    const handleAIExtract = async () => {
        if (!names.trim()) {
            setError("Por favor, cole um texto na área de participantes para usar a extração com IA.");
            return;
        }
        setError('');
        setAiLoading(true);
        try {
            const extracted = await extractNamesFromText(names);
            if (extracted.length > 0) {
                setNames(extracted.join('\n'));
            } else {
                setError("Nenhum nome foi encontrado no texto fornecido.");
            }
        } catch (e: any) {
            setError(e.message || "Ocorreu um erro ao usar a IA.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="bg-light-card dark:bg-dark-card p-6 sm:p-8 rounded-2xl shadow-card w-full max-w-2xl border border-slate-200 dark:border-dark-border space-y-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">Sorteio de Nomes</h2>
            
            <div className="space-y-2">
                <label htmlFor="names-list" className={labelStyles}>Lista de Participantes (um por linha)</label>
                <div className="relative">
                    <textarea id="names-list" value={names} onChange={e => setNames(e.target.value)} rows={10} className={inputStyles} placeholder="Ana Silva&#10;João Costa&#10;..."></textarea>
                     {isAIAvailable() && (
                        <button onClick={handleAIExtract} disabled={aiLoading} className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed dark:from-slate-100 dark:to-slate-200 dark:text-slate-900 dark:hover:from-slate-200 dark:hover:to-slate-300">
                            {aiLoading ? <span className="animate-pulse">Extraindo...</span> : <> <SparklesIcon className="w-4 h-4 text-yellow-300" /> Extrair com IA</>}
                        </button>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <label htmlFor="name-quantity" className={labelStyles}>Quantidade de Nomes a Sortear</label>
                    <input type="number" id="name-quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className={`${inputStyles} max-w-xs`} />
                </div>

                <div className="flex items-center gap-3 pt-6">
                    <input id="remove-drawn" type="checkbox" checked={removeDrawn} onChange={e => setRemoveDrawn(e.target.checked)} className="h-5 w-5 accent-primary rounded-md border-gray-300 focus:ring-primary cursor-pointer" />
                    <label htmlFor="remove-drawn" className="text-sm text-slate-600 dark:text-slate-300 select-none cursor-pointer">Remover nome sorteado da lista</label>
                </div>
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

             <div className="pt-2">
                <button
                    onClick={handleDraw}
                    className="w-full sm:w-auto px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-primary to-accent rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 mx-auto block"
                >
                    Sortear Agora!
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ganhadores">
                <div className="flex flex-wrap justify-center gap-4 p-4">
                    {results.map((result, index) => (
                        <div key={index} className="animate-pop-in px-6 py-3 bg-gradient-to-r from-primary to-accent text-white text-xl font-semibold rounded-full shadow-lg" style={{animationDelay: `${index * 100}ms`}}>
                            {result}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};