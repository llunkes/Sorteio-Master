import React from 'react';

type AdSize = 'leaderboard' | 'medium-rectangle' | 'large-rectangle' | 'banner';

interface AdPlaceholderProps {
    location: string;
    size: AdSize;
}

const sizeMap: Record<AdSize, { dims: string; classes: string }> = {
    'leaderboard': {
        dims: '728x90',
        classes: 'w-[728px] h-[90px]'
    },
    'medium-rectangle': {
        dims: '300x250',
        classes: 'w-[300px] h-[250px]'
    },
    'large-rectangle': {
        dims: '336x280',
        classes: 'w-[336px] h-[280px]'
    },
    'banner': {
        dims: '468x60',
        classes: 'w-[468px] h-[60px]'
    }
};

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ location, size }) => {
    const { dims, classes } = sizeMap[size];

    return (
        <div className="flex justify-center items-center my-2 w-full">
            <div className={`flex justify-center items-center bg-slate-100 dark:bg-dark-card/50 text-center text-slate-400 dark:text-slate-600 text-sm italic border-2 border-dashed border-slate-200 dark:border-dark-border rounded-lg max-w-full overflow-hidden ${classes}`}>
                <div className="p-2">
                    <p>Espaço para Anúncio</p>
                    <p className="font-semibold">{location}</p>
                    <p className="text-xs">({dims})</p>
                </div>
            </div>
        </div>
    );
};