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
        <div className="w-full md:w-1/2 relative">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-l border-neutral-200/50 dark:border-white/10"></div>
            
            {/* Theme Toggle */}
            {showThemeToggle && (
                <motion.button
                    onClick={toggleTheme}
                    className={cn(
                        getThemeToggleClasses(),
                        "p-2.5 md:p-3 rounded-full",
                        "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md",
                        "border border-neutral-300 dark:border-white/20",
                        "shadow-lg hover:shadow-xl",
                        "text-neutral-900 dark:text-white",
                        "transition-all duration-300",
                        "hover:bg-white dark:hover:bg-neutral-800"
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
                                    <Sun className="w-5 h-5 md:w-6 md:h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Moon className="w-5 h-5 md:w-6 md:h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ) : (
                        theme === "dark" ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                </motion.button>
            )}
            
            {/* Form Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 xs:py-16 sm:py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <div className="p-4 xs:p-5 sm:p-6 md:p-8">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

