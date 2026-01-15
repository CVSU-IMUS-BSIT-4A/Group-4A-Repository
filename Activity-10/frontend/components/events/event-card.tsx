"use client";

import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Users, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/hooks/events/use-events";

interface EventCardProps {
    event: Event;
    index: number;
}

const STATUS_STYLES = {
    upcoming: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        label: "Upcoming",
    },
    ongoing: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "Ongoing",
    },
    completed: {
        bg: "bg-neutral-100 dark:bg-neutral-800",
        text: "text-neutral-600 dark:text-neutral-400",
        label: "Completed",
    },
    cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        label: "Cancelled",
    },
};

export function EventCard({ event, index }: EventCardProps) {
    const status = STATUS_STYLES[event.status];
    const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: index * 0.01 }}
            className="group"
        >
            <Link href={`/event/${event.id}`} className="block">
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200">
                    {/* Image Header */}
                    <div className="relative h-32 bg-gradient-to-br from-neutral-800 to-neutral-900 dark:from-neutral-700 dark:to-neutral-800 shrink-0">
                        {event.image ? (
                            <>
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={
                                        event.image.includes('localhost') ||
                                        event.image.includes('127.0.0.1') ||
                                        event.image.includes('192.168.') ||
                                        event.image.includes('10.') ||
                                        event.image.match(/^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./)
                                    }
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] opacity-60" />
                        )}
                        <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${status.bg} ${status.text}`}
                            >
                                {status.label}
                            </span>
                            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded text-xs font-medium text-white/90">
                                {event.category}
                            </span>
                        </div>
                        {!event.image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-neutral-600 dark:text-neutral-500 opacity-50" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-3">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-3 line-clamp-1">
                            {event.description}
                        </p>

                        {/* Compact Details */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span className="truncate">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3 shrink-0" />
                                <span>
                                    {event.attendees}
                                    {event.maxAttendees && `/${event.maxAttendees}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

