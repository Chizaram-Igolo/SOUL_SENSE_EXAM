'use client';

import { BentoGridItem } from './bento-grid';
import { Clock, CheckCircle2, BookText } from 'lucide-react';

export const RecentActivity = () => {
    const activities = [
        { id: 1, type: 'exam', title: 'Monthly Assessment', date: '2 hours ago', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
        { id: 2, type: 'journal', title: 'Morning Reflection', date: '5 hours ago', icon: <BookText className="h-4 w-4 text-blue-500" /> },
        { id: 3, type: 'exam', title: 'Quick Check-in', date: 'Yesterday', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
    ];

    return (
        <BentoGridItem
            title="Recent Activity"
            description="Your latest contributions and assessments."
            header={
                <div className="flex flex-col gap-3 h-full justify-center">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-white/10">
                            {activity.icon}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            }
            icon={<Clock className="h-4 w-4" />}
            className="md:col-span-2"
        />
    );
};
