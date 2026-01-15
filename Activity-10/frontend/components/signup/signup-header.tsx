"use client";

import { motion } from "motion/react";

interface SignUpHeaderProps {
    currentStep: 1 | 2 | 3;
}

export function SignUpHeader({ currentStep }: SignUpHeaderProps) {
    return (
        <div className="text-center mb-8">
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-start text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2"
            >
                Create Account
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                className="text-neutral-700 dark:text-white/70 text-xs xs:text-sm sm:text-sm md:text-base text-start"
            >
                Step {currentStep} of 3
            </motion.p>
        </div>
    );
}

