"use client";

import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import { EventDetail } from "@/lib/api";

interface EventDetailInfoProps {
    event: EventDetail;
    formatDate: (date: string | Date) => string;
    formatTime: (time: string) => string;
}

export function EventDetailInfo({ event, formatDate, formatTime }: EventDetailInfoProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
            >
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-3">
                        About this event
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap leading-relaxed wrap-break-word overflow-wrap-anywhere">
                        {event.description}
                    </p>
                </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                {/* Event Details Card */}
                <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-4">
                        Event Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 shrink-0">
                                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                    Date
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-200 wrap-break-word">
                                    {formatDate(event.date)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 shrink-0">
                                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                    Time
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-200 wrap-break-word">
                                    {formatTime(event.time)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 shrink-0">
                                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                    Location
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-200 wrap-break-word">
                                    {event.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 shrink-0">
                                <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                    Category
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-200 wrap-break-word">
                                    {event.category}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendees Card */}
                <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-4">
                        Attendees
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 shrink-0">
                            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                                {event.attendees}
                                {event.maxAttendees && (
                                    <span className="text-xs sm:text-sm font-normal text-neutral-500">
                                        {" "}/ {event.maxAttendees}
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {event.maxAttendees
                                    ? `${event.maxAttendees - event.attendees} spots left`
                                    : "Unlimited spots"}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar for capacity */}
                    {event.maxAttendees && (
                        <div className="mt-3">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <div
                                    className="h-full rounded-full bg-emerald-500 transition-all"
                                    style={{
                                        width: `${Math.min(
                                            (event.attendees / event.maxAttendees) * 100,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </motion.div>
        </div>
    );
}

