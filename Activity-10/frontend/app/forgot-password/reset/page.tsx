"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import {
    ResetPasswordLoading,
    ResetPasswordError,
    ResetPasswordSuccess,
    ResetPasswordHeader,
    ResetPasswordForm,
} from "@/components/reset-password";
import { useResetPassword } from "@/hooks/auth/use-reset-password";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const {
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
    } = useResetPassword(token);

    if (isVerifying) {
        return (
            <AuthLayout>
                <ResetPasswordLoading />
            </AuthLayout>
        );
    }

    if (tokenError) {
        return (
            <AuthLayout>
                <ResetPasswordError error={tokenError} />
            </AuthLayout>
        );
    }

    if (isSuccess) {
        return (
            <AuthLayout>
                <ResetPasswordSuccess />
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <ResetPasswordHeader email={email} />
            <ResetPasswordForm
                password={password}
                confirmPassword={confirmPassword}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                isLoading={isLoading}
                error={error}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onToggleShowPassword={toggleShowPassword}
                onToggleShowConfirmPassword={toggleShowConfirmPassword}
                onSubmit={handleSubmit}
            />
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <AuthLayout>
                    <ResetPasswordLoading />
                </AuthLayout>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}
