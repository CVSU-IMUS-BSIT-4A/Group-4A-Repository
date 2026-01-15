"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step2OtpFormProps {
    email: string;
    otpCode: string[];
    resendTimer: number;
    error: string;
    isLoading: boolean;
    otpInputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
    onOtpChange: (index: number, value: string) => void;
    onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    onOtpPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    onResendOtp: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function Step2OtpForm({
    email,
    otpCode,
    resendTimer,
    error,
    isLoading,
    otpInputRefs,
    onOtpChange,
    onOtpKeyDown,
    onOtpPaste,
    onResendOtp,
    onSubmit
}: Step2OtpFormProps) {
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
                className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm"
            >
                <p className="font-medium mb-1">Check your email</p>
                <p className="text-xs">We&apos;ve sent a 6-digit verification code to <strong>{email}</strong></p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <label className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2">
                    Verification Code
                </label>
                <div className="flex gap-2 sm:gap-3 justify-center">
                    {otpCode.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                otpInputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => onOtpChange(index, e.target.value)}
                            onKeyDown={(e) => onOtpKeyDown(index, e)}
                            onPaste={onOtpPaste}
                            maxLength={1}
                            className="w-11 h-11 sm:w-13 sm:h-13 text-center text-lg sm:text-xl font-mono font-semibold bg-neutral-100 dark:bg-white/5 border-2 border-neutral-300 dark:border-white/10 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors"
                        />
                    ))}
                </div>
            </motion.div>

            <div className="text-center">
                <button
                    type="button"
                    onClick={onResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className={cn(
                        "text-xs xs:text-sm text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition-colors",
                        (resendTimer > 0 || isLoading) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive code? Resend"}
                </button>
            </div>

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
                disabled={isLoading || otpCode.join("").length !== 6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                whileHover={!isLoading && otpCode.join("").length === 6 ? { scale: 1.02 } : {}}
                whileTap={!isLoading && otpCode.join("").length === 6 ? { scale: 0.98 } : {}}
                className={cn(
                    "w-full px-4 py-2.5 xs:px-5 xs:py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm xs:text-base sm:text-base md:text-lg font-medium text-neutral-900 dark:text-white bg-neutral-200/50 dark:bg-white/20 transition-colors rounded-full backdrop-blur-md border border-neutral-300 dark:border-white/20 flex items-center justify-center gap-2",
                    (isLoading || otpCode.join("").length !== 6) 
                        ? "opacity-50 cursor-not-allowed pointer-events-none" 
                        : "cursor-pointer hover:bg-neutral-300/50 dark:hover:bg-white/30"
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 xs:w-5 xs:h-5 animate-spin" />
                        <span>Verifying...</span>
                    </>
                ) : (
                    "Continue"
                )}
            </motion.button>
        </motion.form>
    );
}

