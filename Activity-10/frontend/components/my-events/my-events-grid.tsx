"use client";

import { motion } from "motion/react";
import { Event } from "@/hooks/my-events";
import { MyEventCard } from "./my-event-card";

interface MyEventsGridProps {
    events: Event[];
}

export function MyEventsGrid({ events }: MyEventsGridProps) {
    return (
        <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            {events.map((event, index) => (
                <MyEventCard key={event.id} event={event} index={index} />
            ))}
        </motion.div>
    );
}
