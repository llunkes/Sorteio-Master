import React, { useState, useContext, useCallback } from 'react';
import { AppContext } from '../App';
import { AppContextType, DrawType } from '../types';
import { Modal } from './Modal';

const inputStyles = "w-full p-3 border border-slate-300 rounded-lg bg-white dark:bg-slate-800/50 dark:border-dark-border focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-inner-soft text-lg";
const labelStyles = "block text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300";

export const NumberDraw: React.FC = () => {
    const { addDrawToHistory } = useContext(AppContext) as AppContextType;
    const [min, setMin] = useState<string>('1');
    const [max, setMax] = useState<string>('100');
    const [quantity, setQuantity] = useState<string>('1');
    const [allowRepeats, setAllowRepeats] = useState<boolean>(false);
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleDraw = useCallback(() => {
        setError('');
        const minNum = parseInt(min, 10);
        const maxNum = parseInt(max, 10);
        const qtyNum = parseInt(quantity, 10);

        if (isNaN(minNum) || isNaN(maxNum) || isNaN(qtyNum)) {
            setError('Por favor, insira números válidos.');
            return;
        }
        if (minNum >= maxNum) {
            setError('O valor mínimo deve ser menor que o valor máximo.');
            return;
        }
        if (qtyNum <= 0) {
            setError('A quantidade deve ser maior que zero.');
            return;
        }

        const range = maxNum - minNum + 1;
        if (!allowRepeats && qtyNum > range) {
            setError('A quantidade de números não pode ser maior que o intervalo disponível sem repetição.');
            return;
        }
        
        const drawnNumbers: number[] = [];
        if (allowRepeats) {
            for (let i = 0; i < qtyNum; i++) {
                drawnNumbers.push(Math.floor(Math.random() * range) + minNum);
            }
        } else {
            const numbers = Array.from({ length: range }, (_, i) => minNum + i);
            for (let i = 0; i < qtyNum; i++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                drawnNumbers.push(numbers.splice(randomIndex, 1)[0]);
            }
        }

        drawnNumbers.sort((a, b) => a - b);

        const stringResults = drawnNumbers.map(String);
        setResults(stringResults);
        addDrawToHistory({
            type: DrawType.NUMBERS,
            results: stringResults,
            config: { min: minNum, max: maxNum, quantity: qtyNum, allowRepeats }
        });
        setIsModalOpen(true);
    }, [min, max, quantity, allowRepeats, addDrawToHistory]);

    return (
        <div className="bg-light-card dark:bg-dark-card p-6 sm:p-8 rounded-2xl shadow-card w-full max-w-2xl border border-slate-200 dark:border-dark-border space-y-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">Sorteio de Números</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="min" className={labelStyles}>Mínimo</label>
                    <input type="number" id="min" value={min} onChange={e => setMin(e.target.value)} className={inputStyles} />
                </div>
                <div>
                    <label htmlFor="max" className={labelStyles}>Máximo</label>
                    <input type="number" id="max" value={max} onChange={e => setMax(e.target.value)} className={inputStyles} />
                </div>
                <div>
                    <label htmlFor="quantity" className={labelStyles}>Quantidade</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className={inputStyles} />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <input id="allow-repeats" type="checkbox" checked={allowRepeats} onChange={e => setAllowRepeats(e.target.checked)} className="h-5 w-5 accent-primary rounded-md border-gray-300 focus:ring-primary cursor-pointer" />
                <label htmlFor="allow-repeats" className="text-sm text-slate-600 dark:text-slate-300 select-none cursor-pointer">Permitir números repetidos</label>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Resultado do Sorteio">
                <div className="flex flex-wrap justify-center gap-4 p-4">
                    {results.map((result, index) => (
                        <div key={index} 
                             className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full shadow-lg animate-pop-in" 
                             style={{animationDelay: `${index * 90}ms`}}>
                             <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-80 mix-blend-multiply"></div>
                             <span className="absolute text-white text-4xl font-bold" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}>{result}</span>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};