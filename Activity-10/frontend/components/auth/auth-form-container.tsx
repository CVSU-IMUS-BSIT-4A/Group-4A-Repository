"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface AuthFormContainerProps {
    children: React.ReactNode;
    showThemeToggle?: boolean;
    themeTogglePosition?: "top-left" | "top-right";
}

export function AuthFormContainer({ 
    children, 
    showThemeToggle = true,
    themeTogglePosition = "top-right"
}: AuthFormContainerProps) {
    const { theme, toggleTheme } = useTheme();

    const getThemeToggleClasses = () => {
        if (themeTogglePosition === "top-left") {
            return "fixed top-4 left-4 z-50";
        }
        return "absolute top-6 right-6 md:top-8 md:right-8 z-20";
    };

    return (
        <div className="relative w-full bg-white dark:bg-neutral-950 md:w-1/2">
            {showThemeToggle && (
                <motion.button
                    onClick={toggleTheme}
                    className={cn(
                        getThemeToggleClasses(),
                        "rounded-full border border-neutral-200 bg-white p-2 text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900",
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle theme"
                >
                    {themeTogglePosition === "top-left" ? (
                        <AnimatePresence mode="wait">
                            {theme === "dark" ? (
                                <motion.div
                                    key="sun"
                                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Sun className="h-5 w-5" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Moon className="h-5 w-5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ) : theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </motion.button>
            )}

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

