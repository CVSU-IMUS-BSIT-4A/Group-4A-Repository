"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { EventDetail } from "@/lib/api";

interface EventDetailBannerProps {
    event: EventDetail;
}

export function EventDetailBanner({ event }: EventDetailBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative w-full h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6"
        >
            {event.image ? (
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={
                        event.image.includes('localhost') ||
                        event.image.includes('127.0.0.1') ||
                        event.image.includes('192.168.') ||
                        event.image.includes('10.') ||
                        event.image.match(/^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./)
                    }
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] opacity-60" />
                    <ImageIcon className="w-16 h-16 text-neutral-600 dark:text-neutral-500" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
    );
}

