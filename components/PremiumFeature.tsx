
import React from 'react';
import { LockClosedIcon } from './Icons';

interface PremiumFeatureLockProps {
  small?: boolean;
}

export const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({ small = false }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        alert('Esta é uma funcionalidade Premium! Faça o upgrade para desbloquear.');
    };

    return (
        <div
            onClick={handleClick}
            className="absolute inset-0 bg-gray-400 dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center rounded-md cursor-pointer group"
        >
            <div className={`flex items-center gap-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full shadow-lg transform transition-transform group-hover:scale-105 ${small ? 'text-xs' : 'text-sm'}`}>
                <LockClosedIcon className={small ? 'w-3 h-3' : 'w-4 h-4'} />
                <span className="font-bold">Premium</span>
            </div>
        </div>
    );
};
