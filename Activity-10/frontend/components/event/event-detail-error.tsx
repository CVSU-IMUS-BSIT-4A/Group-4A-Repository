"use client";

import { motion } from "motion/react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EventDetailErrorProps {
    error: string;
}

export function EventDetailError({ error }: EventDetailErrorProps) {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white px-8 py-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="rounded-2xl bg-red-50 p-4 dark:bg-red-900/30">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                        Event Not Found
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
                        {error}
                    </p>
                </div>
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </Link>
            </motion.div>
        </div>
    );
}

