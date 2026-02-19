'use client';

import { BentoGridItem } from './bento-grid';
import { Smile, Frown, Meh } from 'lucide-react';

export const MoodWidget = () => {
    // Mock data for now
    const moodRating = 8;
    const moodText = "Feeling Positive";

    const getMoodIcon = (rating: number) => {
        if (rating >= 7) return <Smile className="h-4 w-4" />;
        if (rating <= 4) return <Frown className="h-4 w-4" />;
        return <Meh className="h-4 w-4" />;
    };

    return (
        <BentoGridItem
            title="Today's Mood"
            description={`You rated your mood as ${moodRating}/10 today.`}
            header={
                <div className="flex flex-col items-center justify-center h-full min-h-[6rem] bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">{moodRating}</div>
                    <p className="text-sm font-medium mt-2">{moodText}</p>
                </div>
            }
            icon={getMoodIcon(moodRating)}
            className="md:col-span-1"
        />
    );
};
