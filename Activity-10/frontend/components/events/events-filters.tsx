"use client";

import { motion } from "motion/react";
import { Search } from "lucide-react";
import { EventFilter } from "@/hooks/events/use-events";

interface EventsFiltersProps {
    activeFilter: EventFilter;
    onFilterChange: (filter: EventFilter) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isLoading?: boolean;
}

const FILTERS: { value: EventFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
];

export function EventsFilters({
    activeFilter,
    onFilterChange,
    searchQuery,
    onSearchChange,
    isLoading,
}: EventsFiltersProps) {
    return (
        <motion.div
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        disabled={isLoading}
                        className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
                            activeFilter === filter.value
                                ? "text-white"
                                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        }`}
                    >
                        {activeFilter === filter.value && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                                transition={{
                                    type: "tween",
                                    duration: 0.15,
                                }}
                            />
                        )}
                        <span className="relative z-10 dark:mix-blend-difference">
                            {filter.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Search by name, location..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                />
            </div>
        </motion.div>
    );
}

