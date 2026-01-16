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
            className="relative mb-6 h-44 w-full overflow-hidden rounded-3xl sm:h-60 lg:h-80"
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
                <div className="flex h-full w-full items-center justify-center bg-neutral-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.2),transparent_60%)]" />
                    <ImageIcon className="h-16 w-16 text-white/50" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </motion.div>
    );
}

