"use client";

import { motion } from "motion/react";
import { CalendarX, Search } from "lucide-react";

interface EventsEmptyProps {
    hasEvents: boolean;
    searchQuery: string;
}

export function EventsEmpty({ hasEvents, searchQuery }: EventsEmptyProps) {
    // If searching and no results
    if (hasEvents && searchQuery) {
        return (
            <motion.div
                className="flex-1 flex flex-col items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
            >
                <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-900 mb-4">
                    <Search className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                    No events found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-sm">
                    No events matching &quot;{searchQuery}&quot;. Try adjusting your search.
                </p>
            </motion.div>
        );
    }

    // If filtering and no results
    if (hasEvents) {
        return (
            <motion.div
                className="flex-1 flex flex-col items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
            >
                <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-900 mb-4">
                    <CalendarX className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                    No events in this category
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-sm">
                    Try selecting a different filter to see events.
                </p>
            </motion.div>
        );
    }

    // No events at all
    return (
        <motion.div
            className="flex-1 flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
        >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 rounded-full blur-xl opacity-50" />
                <div className="relative p-4 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <CalendarX className="w-8 h-8 text-neutral-400" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                No events available
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-sm">
                There are no events available at the moment. Check back later!
            </p>
        </motion.div>
    );
}

