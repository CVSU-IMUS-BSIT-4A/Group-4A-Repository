"use client";

import { motion } from "motion/react";
import { Event } from "@/hooks/events/use-events";
import { EventCard } from "./event-card";

interface EventsGridProps {
    events: Event[];
}

export function EventsGrid({ events }: EventsGridProps) {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
            ))}
        </motion.div>
    );
}

