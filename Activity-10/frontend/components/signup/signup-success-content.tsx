"use client";

import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SignUpSuccessContentProps {
    email: string | null;
}

export function SignUpSuccessContent({ email }: SignUpSuccessContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center space-y-6"
        >
            {/* Success Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                }}
                className="mb-4"
            >
                <div className="relative">
                    <CheckCircle2 className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 text-green-500 dark:text-green-400" />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 0.6,
                            delay: 0.4,
                            repeat: Infinity,
                            repeatDelay: 2,
                        }}
                        className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
                    />
                </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
            >
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                    Account Created Successfully!
                </h1>
                <p className="text-sm xs:text-base text-neutral-600 dark:text-white/70 max-w-md mx-auto">
                    {email ? (
                        <>
                            Congratulations! Your account has been created. You may now use your account with emaill address:{" "}
                            <span className="font-semibold text-neutral-900 dark:text-white">
                                {email}
                            </span>
                        </>
                    ) : (
                        "Congratulations! Your account has been created successfully."
                    )}
                </p>
            </motion.div>



            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col xs:flex-row gap-3 w-full max-w-md mt-6"
            >
                <Link
                    href="/signin"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-white/90 transition-colors"
                >
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                    href="/"
                    className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white rounded-full font-medium hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors text-center"
                >
                    Go to Home
                </Link>
            </motion.div>


        </motion.div>
    );
}

