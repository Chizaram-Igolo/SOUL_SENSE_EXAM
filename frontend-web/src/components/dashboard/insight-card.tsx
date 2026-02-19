'use client';

import { BentoGridItem } from './bento-grid';
import { Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';

interface InsightCardProps {
    title: string;
    description: string;
    type: 'tip' | 'trend' | 'safety';
    className?: string;
}

export const InsightCard = ({ title, description, type, className }: InsightCardProps) => {
    const getIcon = () => {
        switch (type) {
            case 'tip': return <Lightbulb className="h-4 w-4" />;
            case 'trend': return <TrendingUp className="h-4 w-4" />;
            case 'safety': return <ShieldCheck className="h-4 w-4" />;
        }
    };

    const getColorClass = () => {
        switch (type) {
            case 'tip': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
            case 'trend': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
            case 'safety': return 'bg-green-500/10 text-green-600 dark:text-green-400';
        }
    };

    return (
        <BentoGridItem
            title={title}
            description={description}
            header={
                <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl items-center justify-center ${getColorClass()} bg-opacity-10 border border-white/10`}>
                    {getIcon()}
                </div>
            }
            icon={getIcon()}
            className={className}
        />
    );
};
