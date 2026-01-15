"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api";
import { useAuthRedirect } from "./use-auth-redirect";

export function useForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    useAuthRedirect();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError("Email address must be valid format");
            return;
        }

        setIsLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to send reset link. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const resetSuccess = () => setSuccess(false);

    return {
        email,
        setEmail,
        isLoading,
        error,
        success,
        handleSubmit,
        resetSuccess,
    };
}

