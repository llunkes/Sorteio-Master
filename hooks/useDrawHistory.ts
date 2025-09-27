
import { useState, useEffect, useCallback } from 'react';
import { DrawResult } from '../types';

const HISTORY_STORAGE_KEY = 'sorteioMasterHistory';

export const useDrawHistory = () => {
    const [history, setHistory] = useState<DrawResult[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage:", error);
        }
    }, []);

    const saveHistory = useCallback((newHistory: DrawResult[]) => {
        try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
            setHistory(newHistory);
        } catch (error) {
            console.error("Failed to save history to localStorage:", error);
        }
    }, []);

    const addDrawToHistory = useCallback((result: Omit<DrawResult, 'id' | 'timestamp'>) => {
        const newEntry: DrawResult = {
            ...result,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
        };
        
        setHistory(prevHistory => {
            const updatedHistory = [newEntry, ...prevHistory];
            saveHistory(updatedHistory);
            return updatedHistory;
        });
    }, [saveHistory]);

    const clearHistory = useCallback(() => {
        saveHistory([]);
    }, [saveHistory]);

    return { history, addDrawToHistory, clearHistory };
};
