"use client";

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import Link from "next/link";

interface ForgotPasswordSuccessProps {
    email: string;
    onTryAgain: () => void;
}

export function ForgotPasswordSuccess({
    email,
    onTryAgain,
}: ForgotPasswordSuccessProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center space-y-6"
        >
            {/* Success Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                }}
                className="mb-4"
            >
                <div className="relative">
                    <Mail className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 text-blue-500 dark:text-blue-400" />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 0.6,
                            delay: 0.4,
                            repeat: Infinity,
                            repeatDelay: 2,
                        }}
                        className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
                    />
                </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
            >
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                    Check Your Email
                </h1>
                <p className="text-sm xs:text-base text-neutral-600 dark:text-white/70 max-w-md mx-auto">
                    We&apos;ve sent a password reset link to{" "}
                    <span className="font-semibold text-neutral-900 dark:text-white">
                        {email}
                    </span>
                </p>
            </motion.div>

            {/* Info Box */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            >
                <p className="text-xs xs:text-sm text-blue-800 dark:text-blue-300">
                    Please check your email and click the reset link to create a new
                    password. The link will expire in 30 minutes.
                </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col xs:flex-row gap-3 w-full max-w-md mt-6"
            >
                <Link
                    href="/signin"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-white/90 transition-colors"
                >
                    Back to Sign In
                </Link>
            </motion.div>

            {/* Resend Link */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-neutral-500 dark:text-white/50"
            >
                Didn&apos;t receive the email?{" "}
                <button
                    onClick={onTryAgain}
                    className="text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors cursor-pointer"
                >
                    Try again
                </button>
            </motion.p>
        </motion.div>
    );
}

