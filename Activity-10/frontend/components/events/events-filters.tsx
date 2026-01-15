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
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            {/* Filter Tabs */}
            <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg w-fit">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        disabled={isLoading}
                        className={`relative px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-colors disabled:cursor-not-allowed ${
                            activeFilter === filter.value
                                ? "text-white"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                    >
                        {activeFilter === filter.value && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-neutral-900 dark:bg-white rounded-md"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all"
                />
            </div>
        </motion.div>
    );
}

