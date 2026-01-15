"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";

interface AboutSectionProps {
    showLogo: boolean;
}

export function AboutSection({ showLogo }: AboutSectionProps) {
    const { theme } = useTheme();

    return (
        <section
            id="about"
            className="relative min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 px-3 xs:px-4 sm:px-6 md:px-8 flex items-center snap-start snap-always overflow-y-auto"
        >
            <div className="max-w-7xl mx-auto w-full py-6 sm:py-8 md:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                    {/* Text Content - Left Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4 md:mb-6 flex items-center gap-3">
                            <span>About</span>
                            <div className="relative h-full flex items-center min-h-8 xs:min-h-10 sm:min-h-12 md:min-h-14 lg:min-h-16">
                                <AnimatePresence mode="wait">
                                    {!showLogo ? (
                                        <motion.span
                                            key="text"
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -50 }}
                                            transition={{ duration: 0.5 }}
                                            className="inline-block"
                                        >
                                            Occasio.
                                        </motion.span>
                                    ) : (
                                        <motion.div
                                            key="logo"
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -50 }}
                                            transition={{ duration: 0.5 }}
                                            className="inline-block"
                                        >
                                            <Image
                                                src={
                                                    theme === "dark"
                                                        ? "/whitelogo.png"
                                                        : "/blacklogo.png"
                                                }
                                                alt="Occasio"
                                                width={200}
                                                height={60}
                                                className="h-8 xs:h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </h2>
                        <p className="text-sm xs:text-base sm:text-lg text-neutral-700 dark:text-white/70 leading-relaxed mb-2 sm:mb-3 md:mb-4">
                            Occasio is your all-in-one event management platform designed to
                            make planning and organizing events effortless. Whether you&apos;re
                            organizing a small gathering or a large celebration, we provide
                            the tools you need to create unforgettable experiences.
                        </p>
                        <p className="text-sm xs:text-base sm:text-lg text-neutral-700 dark:text-white/70 leading-relaxed">
                            Our mission is to simplify event planning and help you create
                            memorable moments that bring people together. With intuitive
                            features and powerful tools, Occasio makes it easy to manage every
                            aspect of your events from start to finish.
                        </p>
                    </motion.div>

                    {/* Image - Right Side */}
                    <motion.div
                        className="relative w-full h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80"
                            alt="Event planning and management"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

