"use client";

import { motion } from "motion/react";
import { Check, CalendarDays, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrganizationStepIndicatorProps {
    currentStep: 1 | 2;
}

export function OrganizationStepIndicator({ currentStep }: OrganizationStepIndicatorProps) {
    return (
        <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center justify-center max-w-md mx-auto">
                {[1, 2].map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center relative z-10">
                            <motion.div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                                    currentStep === step
                                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md ring-2 ring-neutral-900/10 dark:ring-white/10"
                                        : currentStep > step
                                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-2 border-neutral-200 dark:border-neutral-700"
                                )}
                                transition={{ type: "tween", duration: 0.1 }}
                            >
                                {currentStep > step ? (
                                    <Check className="w-5 h-5" />
                                ) : step === 1 ? (
                                    <Building2 className="w-5 h-5" />
                                ) : (
                                    <CalendarDays className="w-5 h-5" />
                                )}
                            </motion.div>
                            <p
                                className={cn(
                                    "mt-2 text-xs font-medium transition-colors",
                                    currentStep === step
                                        ? "text-neutral-900 dark:text-white font-semibold"
                                        : currentStep > step
                                        ? "text-neutral-700 dark:text-neutral-300"
                                        : "text-neutral-400 dark:text-neutral-500"
                                )}
                            >
                                {step === 1 && "Organization"}
                                {step === 2 && "Event Details"}
                            </p>
                        </div>
                        {index < 1 && (
                            <div className="w-16 sm:w-24 mx-4 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-neutral-900 dark:bg-white rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: currentStep > step ? "100%" : "0%" }}
                                    transition={{ duration: 0.15, ease: "easeInOut" }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

