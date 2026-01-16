"use client";

import { motion } from "motion/react";

export function EventDetailLoading() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white px-8 py-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white" />
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Loading event...
                </p>
            </motion.div>
        </div>
    );
}

