"use client";

import { motion } from "motion/react";
import { BeamsBackground } from "@/components/ui/beams-background";
import { Footer } from "@/components/ui/footer";

interface OrganizeSectionProps {
    onGetStarted: () => void;
}

export function OrganizeSection({ onGetStarted }: OrganizeSectionProps) {
    return (
        <section
            id="organize"
            className="relative min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 flex flex-col snap-start snap-always overflow-hidden"
        >
            {/* Beams Background */}
            <BeamsBackground hideContent={true} />

            {/* Organize Content */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-0">
                <div className="max-w-4xl mx-auto w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-3 xs:mb-4 sm:mb-4 md:mb-6">
                            Organize Your Events
                        </h2>
                        <p className="text-sm xs:text-base sm:text-lg text-neutral-700 dark:text-white/70 mb-4 xs:mb-6 sm:mb-6 md:mb-8 px-2 xs:px-4">
                            Start planning and organizing your events with ease. Create
                            memorable experiences that bring people together.
                        </p>
                        <motion.button
                            onClick={onGetStarted}
                            className="px-5 py-2.5 xs:px-6 xs:py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 text-sm xs:text-base sm:text-base md:text-lg font-medium text-neutral-900 dark:text-white bg-neutral-200/50 dark:bg-white/20 hover:bg-neutral-300/50 dark:hover:bg-white/30 transition-colors rounded-full backdrop-blur-md border border-neutral-300 dark:border-white/20 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Footer with Animation */}
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <Footer />
            </motion.div>
        </section>
    );
}

