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
                <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="relative h-36 bg-neutral-900">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent_60%)]" />
                        )}
                        <div className="absolute left-4 top-4 right-4 z-10 flex items-center justify-between">
                            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                {event.category}
                            </span>
                            <span
                                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${status.bg} ${status.text}`}
                            >
                                {status.label}
                            </span>
                        </div>
                        {!event.image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-white/50" />
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1 transition-colors group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                            {event.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                            {event.description}
                        </p>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 shrink-0" />
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

