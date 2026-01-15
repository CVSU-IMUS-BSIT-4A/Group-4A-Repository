"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function SignUpFooter() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.18, ease: "easeOut" }}
            className="mt-6 text-center"
        >
            <p className="text-xs xs:text-sm text-neutral-700 dark:text-white/70">
                Already have an account?{" "}
                <Link
                    href="/signin"
                    className="text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-white/80 font-medium transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </motion.div>
    );
}

