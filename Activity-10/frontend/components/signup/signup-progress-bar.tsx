"use client";

import { CheckCircle2, UserCircle, ShieldCheck, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignUpProgressBarProps {
    currentStep: 1 | 2 | 3;
}

export function SignUpProgressBar({ currentStep }: SignUpProgressBarProps) {
    const steps = [
        { step: 1, icon: UserPlus, label: "Account" },
        { step: 2, icon: ShieldCheck, label: "OTP" },
        { step: 3, icon: UserCircle, label: "Personal Info" }
    ];

    return (
        <div className="mb-8">
            <div className="relative w-full px-2">
                {/* Background Line */}
                <div className="absolute left-6 right-6 top-5 h-[2px] bg-neutral-200 dark:bg-white/10" />
                
                {/* Progress Line */}
                <div 
                    className={cn(
                        "absolute left-6 top-5 h-[2px] transition-all duration-500 ease-in-out",
                        "bg-neutral-900 dark:bg-white"
                    )}
                    style={{ 
                        width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                    }}
                />
                
                {/* Steps Container */}
                <div className="relative flex items-start justify-between w-full">
                    {steps.map(({ step, icon: Icon, label }) => (
                        <div key={step} className="flex flex-col items-center flex-1">
                            {/* Step Circle */}
                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 relative z-10 border-2",
                                currentStep === step
                                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white scale-110"
                                    : currentStep > step
                                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                                    : "bg-white dark:bg-neutral-900 text-neutral-400 dark:text-white/40 border-neutral-300 dark:border-white/20"
                            )}>
                                {currentStep > step ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>
                            {/* Step Label */}
                            <span className={cn(
                                "mt-3 text-xs text-center whitespace-nowrap px-1 font-medium transition-colors duration-300",
                                currentStep === step
                                    ? "text-neutral-900 dark:text-white" 
                                    : currentStep > step
                                    ? "text-neutral-700 dark:text-white/80"
                                    : "text-neutral-400 dark:text-white/40"
                            )}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

