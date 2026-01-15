"use client";

import { useState, useEffect } from "react";
import { verifyResetToken, resetPassword } from "@/lib/api";
import { validatePassword } from "@/lib/password-validator";

export function useResetPassword(token: string | null) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState("");
    const [tokenError, setTokenError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [email, setEmail] = useState("");

    // Verify token on mount
    useEffect(() => {
        if (!token) {
            setTokenError(
                "No reset token provided. Please request a new password reset link."
            );
            setIsVerifying(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const result = await verifyResetToken(token);
                setEmail(result.email);
                setIsVerifying(false);
            } catch (err) {
                setTokenError(
                    err instanceof Error ? err.message : "Invalid or expired reset token"
                );
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Password is required");
            return;
        }

        // Validate password requirements
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            const unmetRequirements = passwordValidation.requirements
                .filter((req) => !req.met)
                .map((req) => req.label)
                .join(", ");
            setError(`Password does not meet requirements: ${unmetRequirements}`);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token!, password);
            setIsSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to reset password. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () =>
        setShowConfirmPassword(!showConfirmPassword);

    return {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        showConfirmPassword,
        isLoading,
        isVerifying,
        error,
        tokenError,
        isSuccess,
        email,
        handleSubmit,
        toggleShowPassword,
        toggleShowConfirmPassword,
    };
}

