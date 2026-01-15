"use client";

import { motion } from "motion/react";
import { Calendar } from "lucide-react";

interface EventsHeaderProps {
    eventsCount: number;
    isLoading?: boolean;
}

export function EventsHeader({ eventsCount, isLoading }: EventsHeaderProps) {
    return (
        <motion.div
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-3 sm:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
        >
            {/* Title Row */}
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                    <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        All Events
                    </h1>
                    <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
                        {eventsCount} {eventsCount === 1 ? "event" : "events"} available
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

