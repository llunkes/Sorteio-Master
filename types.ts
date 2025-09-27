import { ReactNode } from "react";

export enum DrawType {
    NUMBERS = 'Números',
    NAMES = 'Nomes',
    GROUPS = 'Grupos',
    HISTORY = 'Histórico',
    SETTINGS = 'Conta',
}

export interface DrawResult {
    id: string;
    type: DrawType;
    timestamp: string;
    results: string[][] | string[];
    config: Record<string, any>;
}

export interface ColorClassSet {
    text: string;
    bg: string;
}

export interface ExportColorPalette {
    name: string;
    pdf: ColorClassSet;
    xlsx: ColorClassSet;
    image: ColorClassSet;
}

export interface AppContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    addDrawToHistory: (result: Omit<DrawResult, 'id' | 'timestamp'>) => void;
    history: DrawResult[];
    clearHistory: () => void;
    exportColorPalette: ExportColorPalette;
    setExportColorPaletteName: (paletteName: string) => void;
}