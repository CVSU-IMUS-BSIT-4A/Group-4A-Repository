"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function ForgotPasswordFooter() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
            className="mt-6 text-center"
        >
            <p className="text-xs xs:text-sm text-neutral-700 dark:text-white/70">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-white/80 font-medium transition-colors"
                >
                    Sign up
                </Link>
            </p>
        </motion.div>
    );
}

