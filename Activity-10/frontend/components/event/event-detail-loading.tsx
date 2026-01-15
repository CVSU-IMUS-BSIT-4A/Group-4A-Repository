"use client";

import { motion } from "motion/react";

export function EventDetailLoading() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-12 h-12 border-3 border-neutral-300 dark:border-neutral-600 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Loading event...
                </p>
            </motion.div>
        </div>
    );
}

