import React, { useState, useContext, useCallback } from 'react';
import { AppContext } from '../App';
import { AppContextType, DrawType } from '../types';
import { Modal } from './Modal';

const inputStyles = "w-full p-3 border border-slate-300 rounded-lg bg-white dark:bg-slate-800/50 dark:border-dark-border focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-inner-soft text-base";
const labelStyles = "block text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300";

export const GroupDraw: React.FC = () => {
    const { addDrawToHistory } = useContext(AppContext) as AppContextType;
    const [names, setNames] = useState<string>('');
    const [groupSize, setGroupSize] = useState<string>('2');
    const [results, setResults] = useState<string[][]>([]);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleDraw = useCallback(() => {
        setError('');
        const participants = names.split('\n').map(n => n.trim()).filter(Boolean);
        const size = parseInt(groupSize, 10);

        if (participants.length < 2) {
            setError('Por favor, insira pelo menos dois participantes.');
            return;
        }
        if (isNaN(size) || size <= 1) {
            setError('O tamanho do grupo deve ser de pelo menos 2.');
            return;
        }
        if (size > participants.length) {
            setError('O tamanho do grupo não pode ser maior que o número de participantes.');
            return;
        }

        const shuffled = [...participants].sort(() => 0.5 - Math.random());
        const groups: string[][] = [];
        for (let i = 0; i < shuffled.length; i += size) {
            groups.push(shuffled.slice(i, i + size));
        }

        setResults(groups);
        addDrawToHistory({
            type: DrawType.GROUPS,
            results: groups,
            config: { groupSize: size, participantsCount: participants.length }
        });
        setIsModalOpen(true);
    }, [names, groupSize, addDrawToHistory]);

    return (
        <div className="bg-light-card dark:bg-dark-card p-6 sm:p-8 rounded-2xl shadow-card w-full max-w-2xl border border-slate-200 dark:border-dark-border space-y-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">Sorteio de Grupos</h2>
            
            <div className="space-y-2">
                <label htmlFor="group-names-list" className={labelStyles}>Lista de Participantes (um por linha)</label>
                <textarea id="group-names-list" value={names} onChange={e => setNames(e.target.value)} rows={10} className={inputStyles} placeholder="Carlos Souza&#10;Beatriz Lima&#10;..."></textarea>
            </div>
            
            <div>
                 <label htmlFor="group-size" className={labelStyles}>Tamanho de cada grupo</label>
                 <input type="number" id="group-size" value={groupSize} onChange={e => setGroupSize(e.target.value)} className={`${inputStyles} max-w-xs`} />
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            
            <div className="pt-2">
                <button
                    onClick={handleDraw}
                    className="w-full sm:w-auto px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-primary to-accent rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 mx-auto block"
                >
                    Formar Grupos!
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Grupos Formados">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4 max-h-[60vh] overflow-y-auto">
                    {results.map((group, index) => (
                        <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm animate-pop-in border border-slate-200 dark:border-dark-border" style={{animationDelay: `${index * 80}ms`}}>
                            <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-3 pb-2 border-b-2 border-primary/20">Grupo {index + 1}</h4>
                            <ul className="space-y-2">
                                {group.map((member, memberIndex) => (
                                    <li key={memberIndex} className="text-slate-700 dark:text-slate-300 font-medium">{member}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};