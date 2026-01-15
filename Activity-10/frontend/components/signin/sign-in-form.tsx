"use client";

import { motion } from "motion/react";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SignInFormProps {
    email: string;
    password: string;
    isLoading: boolean;
    error: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function SignInForm({
    email,
    password,
    isLoading,
    error,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: SignInFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 xs:space-y-5">
            {/* Email Field */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            >
                <label
                    htmlFor="email"
                    className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2"
                >
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50" />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        required
                        placeholder="your@email.com"
                        title="Email address must be valid format"
                        className="w-full pl-8 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base bg-neutral-100 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors"
                    />
                </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.08, ease: "easeOut" }}
            >
                <label
                    htmlFor="password"
                    className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2"
                >
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50" />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="w-full pl-8 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base bg-neutral-100 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors"
                    />
                </div>
            </motion.div>

            {/* Forgot Password */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
                className="flex items-center justify-end text-xs xs:text-sm"
            >
                <Link
                    href="/forgot-password"
                    className="text-xs xs:text-sm text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                    Forgot password?
                </Link>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.12, ease: "easeOut" }}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className={cn(
                    "w-full px-4 py-2.5 xs:px-5 xs:py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm xs:text-base sm:text-base md:text-lg font-medium text-neutral-900 dark:text-white bg-neutral-200/50 dark:bg-white/20 transition-colors rounded-full backdrop-blur-md border border-neutral-300 dark:border-white/20 flex items-center justify-center gap-2",
                    isLoading
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "cursor-pointer hover:bg-neutral-300/50 dark:hover:bg-white/30"
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 xs:w-5 xs:h-5 animate-spin" />
                        <span>Signing In...</span>
                    </>
                ) : (
                    "Sign In"
                )}
            </motion.button>
        </form>
    );
}

