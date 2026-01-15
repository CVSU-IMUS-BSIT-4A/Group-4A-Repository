"use client";

import { motion } from "motion/react";
import { Lock, Loader2, Eye, EyeOff, HelpCircle, Check, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { validatePassword } from "@/lib/password-validator";

interface ResetPasswordFormProps {
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    isLoading: boolean;
    error: string;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onToggleShowPassword: () => void;
    onToggleShowConfirmPassword: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function ResetPasswordForm({
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    onPasswordChange,
    onConfirmPasswordChange,
    onToggleShowPassword,
    onToggleShowConfirmPassword,
    onSubmit,
}: ResetPasswordFormProps) {
    const passwordValidation = validatePassword(password);
    const passwordIsValid = password.length > 0 && passwordValidation.isValid;
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsDoNotMatch = confirmPassword.length > 0 && password !== confirmPassword;

    return (
        <form onSubmit={onSubmit} className="space-y-4 xs:space-y-5">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            >
                <label
                    htmlFor="password"
                    className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2"
                >
                    New Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50" />
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        required
                        placeholder="Enter new password"
                        className={cn(
                            "w-full pl-8 xs:pl-10 pr-20 xs:pr-24 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base bg-neutral-100 dark:bg-white/5 border rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:outline-none transition-colors",
                            passwordIsValid
                                ? "border-green-500 dark:border-green-400 focus:border-green-600 dark:focus:border-green-300"
                                : "border-neutral-300 dark:border-white/10 focus:border-neutral-500 dark:focus:border-white/30"
                        )}
                    />
                    <div className="absolute right-2.5 xs:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {passwordIsValid && (
                            <Check className="w-4 h-4 xs:w-5 xs:h-5 text-green-500 dark:text-green-400" />
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="text-neutral-500 dark:text-white/50 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    <HelpCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="left"
                                className="max-w-xs bg-neutral-900 dark:bg-neutral-800 text-white border-neutral-700 dark:border-neutral-700 p-3"
                            >
                                <div className="space-y-1.5 text-xs">
                                    <p className="font-semibold mb-2">Password Requirements:</p>
                                    <ul className="space-y-1.5">
                                        {passwordValidation.requirements.map((req, index) => (
                                            <li
                                                key={index}
                                                className={cn(
                                                    "flex items-center gap-2 transition-colors",
                                                    req.met ? "text-green-400" : "text-neutral-400"
                                                )}
                                            >
                                                {req.met ? (
                                                    <Check className="w-3.5 h-3.5 shrink-0" />
                                                ) : (
                                                    <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                                                        •
                                                    </span>
                                                )}
                                                <span>{req.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                        <button
                            type="button"
                            onClick={onToggleShowPassword}
                            className="text-neutral-500 dark:text-white/50 hover:text-neutral-700 dark:hover:text-white/70 transition-colors cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4 xs:w-5 xs:h-5" />
                            ) : (
                                <Eye className="w-4 h-4 xs:w-5 xs:h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.08, ease: "easeOut" }}
            >
                <label
                    htmlFor="confirmPassword"
                    className="block text-xs xs:text-sm font-medium text-neutral-900 dark:text-white/90 mb-1.5 xs:mb-2"
                >
                    Confirm Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral-500 dark:text-white/50" />
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => onConfirmPasswordChange(e.target.value)}
                        required
                        placeholder="Confirm new password"
                        className={cn(
                            "w-full pl-8 xs:pl-10 pr-20 xs:pr-24 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base bg-neutral-100 dark:bg-white/5 border rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:outline-none transition-colors",
                            passwordsMatch
                                ? "border-green-500 dark:border-green-400 focus:border-green-600 dark:focus:border-green-300"
                                : passwordsDoNotMatch
                                  ? "border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-300"
                                  : "border-neutral-300 dark:border-white/10 focus:border-neutral-500 dark:focus:border-white/30"
                        )}
                    />
                    <div className="absolute right-2.5 xs:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {passwordsMatch && (
                            <Check className="w-4 h-4 xs:w-5 xs:h-5 text-green-500 dark:text-green-400" />
                        )}
                        {passwordsDoNotMatch && (
                            <XCircle className="w-4 h-4 xs:w-5 xs:h-5 text-red-500 dark:text-red-400" />
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="text-neutral-500 dark:text-white/50 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    <HelpCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="left"
                                className="max-w-xs bg-neutral-900 dark:bg-neutral-800 text-white border-neutral-700 dark:border-neutral-700 p-3"
                            >
                                <div className="space-y-1.5 text-xs">
                                    <p className="font-semibold mb-2">Confirm Password:</p>
                                    <p className="text-neutral-300">
                                        The password must match the password entered above.
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                        <button
                            type="button"
                            onClick={onToggleShowConfirmPassword}
                            className="text-neutral-500 dark:text-white/50 hover:text-neutral-700 dark:hover:text-white/70 transition-colors cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4 xs:w-5 xs:h-5" />
                            ) : (
                                <Eye className="w-4 h-4 xs:w-5 xs:h-5" />
                            )}
                        </button>
                    </div>
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
                        <span>Resetting Password...</span>
                    </>
                ) : (
                    "Reset Password"
                )}
            </motion.button>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.12, ease: "easeOut" }}
                className="text-center"
            >
                <Link
                    href="/signin"
                    className="text-xs xs:text-sm text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                    Back to Sign In
                </Link>
            </motion.div>
        </form>
    );
}
