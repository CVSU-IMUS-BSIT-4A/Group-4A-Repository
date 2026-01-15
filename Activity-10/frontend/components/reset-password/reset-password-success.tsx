"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function ResetPasswordSuccess() {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                <CheckCircle2 className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 text-green-500 dark:text-green-400" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                    Password Reset!
                </h2>
                <p className="text-sm xs:text-base text-neutral-600 dark:text-white/70 max-w-md mx-auto">
                    Your password has been successfully reset. You can now sign in with
                    your new password.
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md mt-6"
            >
                <Link
                    href="/signin"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-white/90 transition-colors cursor-pointer"
                >
                    Sign In Now
                </Link>
            </motion.div>
        </div>
    );
}

