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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
            >
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 md:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-3 sm:mb-4">
                        About this event
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap leading-relaxed wrap-break-word overflow-wrap-anywhere">
                        {event.description}
                    </p>
                </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 sm:space-y-4"
            >
                {/* Event Details Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white mb-3 sm:mb-4">
                        Event Details
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                                    Date
                                </p>
                                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 wrap-break-word">
                                    {formatDate(event.date)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                                    Time
                                </p>
                                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 wrap-break-word">
                                    {formatTime(event.time)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                                    Location
                                </p>
                                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 wrap-break-word">
                                    {event.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                                    Category
                                </p>
                                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 wrap-break-word">
                                    {event.category}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendees Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white mb-3 sm:mb-4">
                        Attendees
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
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
                        <div className="mt-2 sm:mt-3">
                            <div className="w-full h-1.5 sm:h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all"
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

