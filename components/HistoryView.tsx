import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../App';
import { AppContextType, DrawResult, DrawType, ExportColorPalette } from '../types';
import { TrashIcon, DownloadIcon, PdfIcon, ExcelIcon, ImageIcon, SpinnerIcon } from './Icons';
import { exportAsPdf, exportAsXlsx, exportAsImage } from '../services/exportService';
import { Modal } from './Modal';

// Helper to format config details
const formatConfig = (config: Record<string, any>): string => {
    const translations: Record<string, string> = {
        min: 'Mínimo',
        max: 'Máximo',
        quantity: 'Quantidade',
        allowRepeats: 'Repetir números',
        removeDrawn: 'Remover sorteado',
        initialCount: 'Total de nomes',
        groupSize: 'Tamanho do grupo',
        participantsCount: 'Total de participantes'
    };

    return Object.entries(config)
        .map(([key, value]) => {
            const label = translations[key] || key;
            const formattedValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value;
            return `${label}: ${formattedValue}`;
        })
        .join(' ・ ');
};

// Enhanced component to display results with more context
const ResultDisplay: React.FC<{ result: DrawResult }> = ({ result }) => {
    const { type, results, config } = result;

    switch (type) {
        case DrawType.NUMBERS: {
            const items = results as string[];
            const preview = items.slice(0, 8).join(', ');
            const summary = `Sorteado(s) ${config.quantity} número(s) de ${config.min} a ${config.max}`;
            return (
                <>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{summary}</p>
                    <p className="text-xl font-bold mt-1 text-slate-700 dark:text-slate-200 truncate" title={items.join(', ')}>
                        {preview}{items.length > 8 ? '...' : ''}
                    </p>
                </>
            );
        }
        case DrawType.NAMES: {
            const items = results as string[];
            const preview = items.slice(0, 5).join(', ');
            const summary = `${config.quantity} vencedor(es) de ${config.initialCount} participantes`;
            return (
                <>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{summary}</p>
                    <p className="text-xl font-bold mt-1 text-slate-700 dark:text-slate-200 truncate" title={items.join(', ')}>
                        {preview}{items.length > 5 ? '...' : ''}
                    </p>
                </>
            );
        }
        case DrawType.GROUPS: {
            const groups = results as string[][];
            const groupComposition = groups.map((g, i) => `G${i + 1}: ${g.length}`).slice(0, 4).join(' | ');
            const summary = `${groups.length} grupos formados. Composição: ${groupComposition}${groups.length > 4 ? '...' : ''}`;
            const totalParticipants = `Total de ${config.participantsCount} participantes.`;
            return (
                 <>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{summary}</p>
                    <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{totalParticipants}</p>
                </>
            );
        }
        default:
            const items = (results as (string[] | string[][])).flat();
            const preview = items.slice(0, 5).join(', ');
             return (
                <p className="text-xl font-bold mt-2 text-slate-700 dark:text-slate-200 truncate" title={items.join(', ')}>
                    {preview}{items.length > 5 ? '...' : ''}
                </p>
            );
    }
};

// Sub-component for each history item
const HistoryItem: React.FC<{ result: DrawResult; palette: ExportColorPalette }> = ({ result, palette }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [exportingType, setExportingType] = useState<'pdf' | 'xlsx' | 'image' | null>(null);

    const handleExport = async (type: 'pdf' | 'xlsx' | 'image') => {
        if (exportingType) return;

        setExportingType(type);

        // For image export, wait a moment to ensure DOM is stable before capturing
        if (type === 'image') {
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        try {
            switch (type) {
                case 'pdf':
                    exportAsPdf(result);
                    break;
                case 'xlsx':
                    exportAsXlsx(result);
                    break;
                case 'image':
                    if (cardRef.current) {
                        await exportAsImage(cardRef.current, `sorteio-${result.id}.png`);
                    }
                    break;
            }
        } catch (error) {
            console.error(`Failed to export as ${type}:`, error);
            alert(`Ocorreu um erro ao exportar como ${type}.`);
        } finally {
            setExportingType(null);
            setIsMenuOpen(false);
        }
    };
    
    const buttonClass = "w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-60 disabled:cursor-wait";

    return (
        <div ref={cardRef} className="bg-light-card dark:bg-dark-card p-5 rounded-xl shadow-md border border-slate-200 dark:border-dark-border w-full flex flex-col sm:flex-row justify-between items-start gap-4 transition-shadow hover:shadow-lg">
            <div className="flex-grow">
                <div className="flex items-center gap-3 flex-wrap">
                     <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light">{result.type}</span>
                     <span className="text-sm text-slate-500 dark:text-slate-400">{new Date(result.timestamp).toLocaleString('pt-BR')}</span>
                </div>
                <div className="mt-2">
                    <ResultDisplay result={result} />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">{formatConfig(result.config)}</p>
            </div>
            <div className="relative shrink-0 self-end sm:self-center">
                <button
                    onClick={() => !exportingType && setIsMenuOpen(!isMenuOpen)}
                    disabled={!!exportingType}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Opções de Exportação"
                >
                    <DownloadIcon className="w-5 h-5" />
                </button>
                {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-light dark:bg-dark-card py-1 ring-1 ring-black ring-opacity-5 z-10 border border-slate-200 dark:border-dark-border">
                        <button onClick={() => handleExport('pdf')} disabled={!!exportingType} className={buttonClass}>
                            {exportingType === 'pdf' ? (
                                <>
                                    <SpinnerIcon className="w-4 h-4 animate-spinner-rotate" />
                                    <span>Exportando...</span>
                                </>
                            ) : (
                                <>
                                    <PdfIcon className={`w-4 h-4 ${palette.pdf.text}`} />
                                    <span>Exportar como PDF</span>
                                </>
                            )}
                        </button>
                         <button onClick={() => handleExport('xlsx')} disabled={!!exportingType} className={buttonClass}>
                            {exportingType === 'xlsx' ? (
                                <>
                                    <SpinnerIcon className="w-4 h-4 animate-spinner-rotate" />
                                    <span>Exportando...</span>
                                </>
                            ) : (
                                <>
                                    <ExcelIcon className={`w-4 h-4 ${palette.xlsx.text}`} />
                                    <span>Exportar como Excel</span>
                                </>
                            )}
                        </button>
                        <button onClick={() => handleExport('image')} disabled={!!exportingType} className={buttonClass}>
                            {exportingType === 'image' ? (
                                <>
                                    <SpinnerIcon className="w-4 h-4 animate-spinner-rotate" />
                                    <span>Exportando...</span>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className={`w-4 h-4 ${palette.image.text}`} />
                                    <span>Exportar como Imagem</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


export const HistoryView: React.FC = () => {
    const { history, clearHistory, exportColorPalette } = useContext(AppContext) as AppContextType;
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleClearHistory = () => {
        clearHistory();
        setShowClearConfirm(false);
    };

    return (
        <div className="space-y-8 w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Histórico de Sorteios</h2>
                {history.length > 0 && (
                    <button 
                        onClick={() => setShowClearConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors active:scale-95"
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span>Limpar Histórico</span>
                    </button>
                )}
            </div>
            
            <div>
                {history.length === 0 ? (
                    <div className="text-center py-10 bg-light-card dark:bg-dark-card rounded-2xl shadow-card border border-slate-200 dark:border-dark-border">
                        <p className="text-slate-500 dark:text-slate-400">Nenhum sorteio encontrado no seu histórico.</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Os sorteios que você realizar aparecerão aqui.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map(draw => (
                            <HistoryItem key={draw.id} result={draw} palette={exportColorPalette} />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Confirmar Limpeza do Histórico">
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Tem certeza que deseja apagar permanentemente todo o seu histórico de sorteios? Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end gap-3">
                     <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-5 py-2 font-semibold rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleClearHistory}
                        className="px-5 py-2 font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Sim, Limpar Histórico
                    </button>
                </div>
            </Modal>
        </div>
    );
};