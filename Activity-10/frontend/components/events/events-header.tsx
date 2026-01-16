"use client";

import { motion } from "motion/react";
import { CalendarDays } from "lucide-react";

interface EventsHeaderProps {
    eventsCount: number;
    isLoading?: boolean;
}

export function EventsHeader({ eventsCount }: EventsHeaderProps) {
    return (
        <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
        >
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                            Event directory
                        </p>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                            Upcoming events
                        </h1>
                    </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {eventsCount} {eventsCount === 1 ? "event" : "events"} available to register.
                </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-300">
                Live listings
            </div>
        </motion.div>
    );
}

