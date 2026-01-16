"use client";

import { motion } from "motion/react";
import { CalendarX, Search, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

type EventType = "joined" | "organized";

interface MyEventsEmptyProps {
    hasEvents: boolean;
    searchQuery: string;
    eventType: EventType;
    onOrganizeClick?: () => void;
}

export function MyEventsEmpty({ hasEvents, searchQuery, eventType, onOrganizeClick }: MyEventsEmptyProps) {
    const isOrganized = eventType === "organized";

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
                    Try selecting a different filter to see your events.
                </p>
            </motion.div>
        );
    }

    // No events at all
    return (
        <motion.div
            className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-950"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900">
                <CalendarX className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                {isOrganized ? "No events organized yet" : "No events yet"}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mb-6">
                {isOrganized 
                    ? "You haven't organized any events yet. Create your first event and start bringing people together!"
                    : "You haven't joined any events yet. Browse our catalog and find something exciting!"}
            </p>
            {isOrganized ? (
                <button
                    onClick={onOrganizeClick}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 group"
                >
                    Organize Event
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
            ) : (
            <Link
                    href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 group"
            >
                Browse Events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            )}
        </motion.div>
    );
}
