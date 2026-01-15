"use client";

import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordHeader() {
    return (
        <>
            {/* Back Link - Upper Left */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-4 left-4 xs:top-5 xs:left-5 sm:top-6 sm:left-6"
            >
                <Link
                    href="/signin"
                    className="inline-flex items-center gap-1 text-xs xs:text-sm text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Sign In
                </Link>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-start text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2"
                >
                    Forgot Password
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="text-neutral-700 dark:text-white/70 text-xs xs:text-sm sm:text-sm md:text-base text-start"
                >
                    Enter your email address and we&apos;ll send you a link to reset your
                    password
                </motion.p>
            </div>
        </>
    );
}

