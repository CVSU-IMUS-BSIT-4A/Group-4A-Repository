"use client";

import { motion } from "motion/react";
import { User, Calendar, UserCircle, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step3PersonalInfoFormProps {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say' | '';
    birthdate: string;
    error: string;
    isLoading: boolean;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onGenderChange: (value: 'male' | 'female' | 'other' | 'prefer-not-to-say' | '') => void;
    onBirthdateChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function Step3PersonalInfoForm({
    firstName,
    lastName,
    gender,
    birthdate,
    error,
    isLoading,
    onFirstNameChange,
    onLastNameChange,
    onGenderChange,
    onBirthdateChange,
    onSubmit
}: Step3PersonalInfoFormProps) {
    return (
        <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 xs:space-y-5"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <label htmlFor="firstName" className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2">
                    First Name
                </label>
                <div className="relative">
                    <User className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50" />
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => onFirstNameChange(e.target.value)}
                        required
                        placeholder="John"
                        className="w-full pl-8 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base bg-neutral-100 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
            >
                <label htmlFor="lastName" className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2">
                    Last Name
                </label>
                <div className="relative">
                    <User className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50" />
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => onLastNameChange(e.target.value)}
                        required
                        placeholder="Doe"
                        className="w-full pl-8 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base bg-neutral-100 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            >
                <label htmlFor="gender" className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2">
                    Gender (Optional)
                </label>
                <div className="relative">
                    <UserCircle className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50 z-10 pointer-events-none" />
                    <select
                        id="gender"
                        value={gender}
                        onChange={(e) => onGenderChange(e.target.value as typeof gender)}
                        className={cn(
                            "w-full pl-8 xs:pl-10 pr-10 xs:pr-12 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base",
                            "bg-neutral-100 dark:bg-white/5",
                            "border border-neutral-300 dark:border-white/10",
                            "rounded-lg",
                            "text-neutral-900 dark:text-white",
                            "placeholder:text-neutral-500 dark:placeholder:text-white/50",
                            "focus:outline-none focus:border-neutral-500 dark:focus:border-white/30",
                            "transition-colors",
                            "appearance-none cursor-pointer",
                            "[&>option]:bg-white [&>option]:dark:bg-neutral-900 [&>option]:text-neutral-900 [&>option]:dark:text-white"
                        )}
                    >
                        <option value="" className="bg-white dark:bg-neutral-900 text-neutral-500 dark:text-white/50">
                            Select gender
                        </option>
                        <option value="male" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                            Male
                        </option>
                        <option value="female" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                            Female
                        </option>
                        <option value="other" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                            Other
                        </option>
                        <option value="prefer-not-to-say" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                            Prefer not to say
                        </option>
                    </select>
                    <ChevronDown className="absolute right-2.5 xs:right-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50 pointer-events-none" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.08, ease: "easeOut" }}
            >
                <label htmlFor="birthdate" className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2">
                    Birthdate (Optional)
                </label>
                <div className="relative">
                    <Calendar className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50" />
                    <input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={(e) => onBirthdateChange(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full pl-8 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base bg-neutral-100 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors"
                    />
                </div>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
                >
                    {error}
                </motion.div>
            )}

            <motion.button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
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
                        <span>Signing Up...</span>
                    </>
                ) : (
                    "Sign Up"
                )}
            </motion.button>
        </motion.form>
    );
}

