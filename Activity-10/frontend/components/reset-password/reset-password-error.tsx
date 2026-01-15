"use client";

import { motion } from "motion/react";
import { XCircle } from "lucide-react";
import Link from "next/link";

interface ResetPasswordErrorProps {
    error: string;
}

export function ResetPasswordError({ error }: ResetPasswordErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                <XCircle className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 text-red-500 dark:text-red-400" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                    Invalid Link
                </h2>
                <p className="text-sm xs:text-base text-neutral-600 dark:text-white/70 max-w-md mx-auto">
                    {error}
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col xs:flex-row gap-3 w-full max-w-md mt-6"
            >
                <Link
                    href="/forgot-password"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-white/90 transition-colors cursor-pointer"
                >
                    Request New Link
                </Link>
                <Link
                    href="/signin"
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white rounded-full font-medium hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                    Back to Sign In
                </Link>
            </motion.div>
        </div>
    );
}

