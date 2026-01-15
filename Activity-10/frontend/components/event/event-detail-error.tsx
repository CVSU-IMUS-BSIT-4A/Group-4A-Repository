"use client";

import { motion } from "motion/react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EventDetailErrorProps {
    error: string;
}

export function EventDetailError({ error }: EventDetailErrorProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 text-center px-4"
            >
                <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                        Event Not Found
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
                        {error}
                    </p>
                </div>
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </Link>
            </motion.div>
        </div>
    );
}

