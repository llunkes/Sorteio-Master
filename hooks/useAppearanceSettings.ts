import { useState, useEffect, useCallback } from 'react';
import { ExportColorPalette } from '../types';

const APPEARANCE_SETTINGS_KEY = 'sorteioMasterAppearanceSettings';

export const definedPalettes: Record<string, ExportColorPalette> = {
    'Padrão': { 
        name: 'Padrão', 
        pdf:   { text: 'text-red-500',   bg: 'bg-red-500' }, 
        xlsx:  { text: 'text-green-500', bg: 'bg-green-500' }, 
        image: { text: 'text-blue-500',  bg: 'bg-blue-500' } 
    },
    'Vibrante': { 
        name: 'Vibrante', 
        pdf:   { text: 'text-orange-500', bg: 'bg-orange-500' }, 
        xlsx:  { text: 'text-teal-500',   bg: 'bg-teal-500' }, 
        image: { text: 'text-indigo-500', bg: 'bg-indigo-500' } 
    },
    'Monocromático': { 
        name: 'Monocromático', 
        pdf:   { text: 'text-slate-500', bg: 'bg-slate-500' }, 
        xlsx:  { text: 'text-slate-500', bg: 'bg-slate-500' }, 
        image: { text: 'text-slate-500', bg: 'bg-slate-500' } 
    },
};

const defaultPalette = definedPalettes['Padrão'];

interface AppearanceSettings {
    exportColorPaletteName: string;
}

export const useAppearanceSettings = () => {
    const [settings, setSettings] = useState<AppearanceSettings>({
        exportColorPaletteName: defaultPalette.name,
    });

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem(APPEARANCE_SETTINGS_KEY);
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                if (definedPalettes[parsedSettings.exportColorPaletteName]) {
                   setSettings(parsedSettings);
                }
            }
        } catch (error) {
            console.error("Failed to load appearance settings:", error);
        }
    }, []);

    const saveSettings = useCallback((newSettings: AppearanceSettings) => {
        try {
            localStorage.setItem(APPEARANCE_SETTINGS_KEY, JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error("Failed to save appearance settings:", error);
        }
    }, []);
    
    const setExportColorPaletteName = useCallback((paletteName: string) => {
        if (definedPalettes[paletteName]) {
            saveSettings({ ...settings, exportColorPaletteName: paletteName });
        }
    }, [settings, saveSettings]);

    const exportColorPalette = definedPalettes[settings.exportColorPaletteName] || defaultPalette;

    return { exportColorPalette, setExportColorPaletteName };
};