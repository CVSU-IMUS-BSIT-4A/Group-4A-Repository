"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CalendarDays, Search, Plus, Clock } from "lucide-react";
import Link from "next/link";

export type EventType = "joined" | "organized";

interface MyEventsHeaderProps {
    eventsCount: number;
    eventType: EventType;
    onEventTypeChange: (type: EventType) => void;
    isLoading?: boolean;
    joinedCount: number;
    organizedCount: number;
    shouldOpenOrganizeModal?: boolean;
    onOrganizeModalOpenChange?: () => void;
    isOrganizeModalOpen?: boolean;
    onOrganizeModalOpenChangeInternal?: (open: boolean) => void;
    hasRejectedOrgs?: boolean;
    hasPendingOrgs?: boolean;
}

export function MyEventsHeader({ 
    eventsCount, 
    eventType, 
    onEventTypeChange, 
    isLoading, 
    joinedCount, 
    organizedCount,
    shouldOpenOrganizeModal = false,
    onOrganizeModalOpenChange,
    isOrganizeModalOpen: externalIsOpen,
    onOrganizeModalOpenChangeInternal,
    hasRejectedOrgs = false,
    hasPendingOrgs = false,
}: MyEventsHeaderProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    
    // Use external state if provided, otherwise use internal
    const isOrganizeModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsOrganizeModalOpen = onOrganizeModalOpenChangeInternal || setInternalIsOpen;

    // Open modal when shouldOpenOrganizeModal is true
    useEffect(() => {
        if (shouldOpenOrganizeModal) {
            setIsOrganizeModalOpen(true);
            // Clear the flag after opening
            onOrganizeModalOpenChange?.();
        }
    }, [shouldOpenOrganizeModal, onOrganizeModalOpenChange, setIsOrganizeModalOpen]);
    
    // Handle button clicks to open modal
    const handleOpenModal = () => {
        setIsOrganizeModalOpen(true);
    };

    return (
        <>
            <motion.div
                className="mb-6 flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
            >
            {/* Title Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                            My schedule
                        </p>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                            My Events
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {eventsCount} {eventsCount === 1 ? "event" : "events"} {eventType === "organized" ? "organized" : "joined"}
                        </p>
                    </div>
                </div>

                {/* Action Buttons - Mobile only inline */}
                <div className="flex items-center gap-2 sm:hidden">
                    <Link
                        href="/events"
                        className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white p-2 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                        title="Browse Events"
                    >
                        <Search className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={handleOpenModal}
                        className="relative inline-flex items-center justify-center rounded-full bg-neutral-900 p-2 text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                        title="Organize Event"
                    >
                        <Plus className="w-4 h-4" />
                        {hasPendingOrgs ? (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center">
                                <Clock className="w-2.5 h-2.5 text-white" />
                            </span>
                        ) : hasRejectedOrgs ? (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900" />
                        ) : null}
                    </button>
                </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-3 sm:justify-between">
                {/* Event Type Toggle */}
                <div className="flex items-center rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
                    <button
                        onClick={() => onEventTypeChange("joined")}
                        disabled={isLoading}
                        className={`relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed ${
                            eventType === "joined"
                                ? "text-white"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                    >
                        {eventType === "joined" && (
                            <motion.div
                                layoutId="eventTypeToggle"
                                className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                                transition={{
                                    type: "tween",
                                    duration: 0.15,
                                }}
                            />
                        )}
                        <span className="relative z-10 dark:mix-blend-difference flex items-center gap-1.5">
                            Joined
                            {joinedCount > 0 && (
                                <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                                    eventType === "joined"
                                        ? "bg-white/30 dark:bg-neutral-900/30"
                                        : "bg-neutral-400/20 dark:bg-neutral-500/20"
                                }`}>
                                    {joinedCount}
                                </span>
                            )}
                        </span>
                    </button>
                    <button
                        onClick={() => onEventTypeChange("organized")}
                        disabled={isLoading}
                        className={`relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed ${
                            eventType === "organized"
                                ? "text-white"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                    >
                        {eventType === "organized" && (
                            <motion.div
                                layoutId="eventTypeToggle"
                                className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                                transition={{
                                    type: "tween",
                                    duration: 0.15,
                                }}
                            />
                        )}
                        <span className="relative z-10 dark:mix-blend-difference flex items-center gap-1.5">
                            Organized
                            {organizedCount > 0 && (
                                <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                                    eventType === "organized"
                                        ? "bg-white/30 dark:bg-neutral-900/30"
                                        : "bg-neutral-400/20 dark:bg-neutral-500/20"
                                }`}>
                                    {organizedCount}
                                </span>
                            )}
                        </span>
                    </button>
                </div>

                {/* Action Buttons - Desktop only */}
                <div className="hidden sm:flex items-center gap-2">
                    <Link
                        href="/events"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                    >
                        <Search className="w-4 h-4" />
                        <span>Browse</span>
                    </Link>
                    <button
                        onClick={handleOpenModal}
                        className="relative inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Organize</span>
                        {hasPendingOrgs ? (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center">
                                <Clock className="w-3 h-3 text-white" />
                            </span>
                        ) : hasRejectedOrgs ? (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900" />
                        ) : null}
                    </button>
                </div>
            </div>
        </motion.div>
        </>
    );
}
