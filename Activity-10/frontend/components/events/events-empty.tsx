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
                className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-950"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
            >
                <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
                    <Search className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                    No events found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
                    No events matching &quot;{searchQuery}&quot;. Try adjusting your search.
                </p>
            </motion.div>
        );
    }

    // If filtering and no results
    if (hasEvents) {
        return (
            <motion.div
                className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-950"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
            >
                <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
                    <CalendarX className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                    No events in this category
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
                    Try selecting a different filter to see events.
                </p>
            </motion.div>
        );
    }

    // No events at all
    return (
        <motion.div
            className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
        >
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900">
                <CalendarX className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                No events available
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
                There are no events available at the moment. Check back later!
            </p>
        </motion.div>
    );
}

