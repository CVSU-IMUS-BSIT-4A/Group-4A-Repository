"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { BeamsBackground } from "@/components/ui/beams-background";
import { Navbar } from "@/components/ui/navbar";

interface HeroSectionProps {
    onScrollToAbout: () => void;
}

export function HeroSection({ onScrollToAbout }: HeroSectionProps) {
    return (
        <section
            id="hero"
            className="relative h-screen w-full flex items-center justify-center snap-start snap-always"
        >
            <BeamsBackground />
            <Navbar />

            {/* Scroll Down Button */}
            <motion.button
                onClick={onScrollToAbout}
                className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 p-3 md:p-4 bg-neutral-200/50 dark:bg-white/20 backdrop-blur-md rounded-full border-2 border-neutral-300 dark:border-white/30 text-neutral-900 dark:text-white hover:bg-neutral-300/50 dark:hover:bg-white/30 hover:border-neutral-400 dark:hover:border-white/50 transition-all shadow-lg cursor-pointer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 drop-shadow-lg" />
                </motion.div>
            </motion.button>
        </section>
    );
}

