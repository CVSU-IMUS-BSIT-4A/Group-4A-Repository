"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";

export function AuthBranding() {
    const { theme } = useTheme();

    return (
        <div className="hidden md:flex w-1/2 items-center justify-center relative">
            <motion.div
                className="text-left px-8 lg:px-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <motion.div
                    className="mb-4 flex items-center gap-3 md:gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
                >
                    <Link href="/" className="flex items-center gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                        <Image
                            src={theme === "dark" ? "/whitelogo.png" : "/blacklogo.png"}
                            alt="Occasio"
                            width={200}
                            height={60}
                            className="h-12 md:h-14 lg:h-16 xl:h-20 w-auto"
                            priority
                        />
                        <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Occasio
                        </span>
                    </Link>
                </motion.div>
                <motion.p
                    className="text-md md:text-lg lg:text-xl text-neutral-700 dark:text-white/70 font-normal tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                >
                    Every Occasion, Perfectly Planned.
                </motion.p>
            </motion.div>
            
            {/* Copyright - Bottom Left */}
            <motion.p
                className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 text-xs md:text-sm text-neutral-600 dark:text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
            >
                © 2026 Occasio. All rights reserved.
            </motion.p>
        </div>
    );
}

