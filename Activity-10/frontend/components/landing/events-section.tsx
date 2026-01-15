"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/api";
import Link from "next/link";
import { Calendar, Clock, MapPin, Users, ImageIcon, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

interface LandingEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    category: string;
    attendees: number;
    maxAttendees?: number;
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

export function EventsSection() {
    const [events, setEvents] = useState<LandingEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Fetch only upcoming events for landing page (limit to 6)
                const response = await getAllEvents(1, 6, "upcoming");

                // Transform the API response to match our Event interface
                const transformedEvents: LandingEvent[] = response.events
                    .filter((event) => 
                        event.status === "upcoming" || 
                        event.status === "ongoing" || 
                        event.status === "completed" || 
                        event.status === "cancelled"
                    )
                    .map((event) => ({
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        date: event.date,
                        time: event.time,
                        location: event.location,
                        image: event.image,
                        status: event.status as "upcoming" | "ongoing" | "completed" | "cancelled",
                        category: event.category,
                        attendees: event.attendees || 0,
                        maxAttendees: event.maxAttendees,
                    }));

                setEvents(transformedEvents);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError("Failed to load events. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        void fetchEvents();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <section
            id="events"
            className="relative min-h-screen w-full bg-neutral-100 dark:bg-neutral-900 px-3 xs:px-4 sm:px-6 md:px-8 flex items-center snap-start snap-always overflow-y-auto"
        >
            <div className="max-w-7xl mx-auto w-full py-6 sm:py-8 md:py-0">
                <motion.div
                    className="text-center mb-6 sm:mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-2 sm:mb-3 md:mb-4">
                        Discover Events
                    </h2>
                    <p className="text-sm xs:text-base sm:text-lg text-neutral-700 dark:text-white/70 max-w-2xl mx-auto px-2 sm:px-4">
                        Explore upcoming events and join the ones that interest you
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 dark:text-neutral-400">No upcoming events available at the moment.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10">
                            {events.map((event, index) => {
                                const status = STATUS_STYLES[event.status];
                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <Link href={`/event/${event.id}`} className="block">
                                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-lg transition-all duration-200 h-full">
                                                {/* Image Header */}
                                                <div className="relative h-40 bg-linear-to-br from-neutral-800 to-neutral-900 dark:from-neutral-700 dark:to-neutral-800 shrink-0">
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
                                                                    !!event.image.match(/^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./)
                                                                }
                                                            />
                                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                                                        </>
                                                    ) : (
                                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] opacity-60" />
                                                    )}
                                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
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
                                                            <ImageIcon className="w-10 h-10 text-neutral-600 dark:text-neutral-500 opacity-50" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-4">
                                                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                                                        {event.description}
                                                    </p>

                                                    {/* Event Details */}
                                                    <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 shrink-0" />
                                                            <span className="truncate">{formatDate(event.date)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 shrink-0" />
                                                            <span className="truncate">{event.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 shrink-0" />
                                                            <span className="truncate">{event.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 shrink-0" />
                                                            <span>
                                                                {event.attendees}
                                                                {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* View All Events Button */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Link
                                href="/events"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                            >
                                View All Events
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
}
