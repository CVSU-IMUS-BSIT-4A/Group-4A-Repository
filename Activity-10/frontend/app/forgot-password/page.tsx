"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import {
    ForgotPasswordHeader,
    ForgotPasswordForm,
    ForgotPasswordSuccess,
    ForgotPasswordFooter,
} from "@/components/forgot-password";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";

export default function ForgotPasswordPage() {
    const {
        email,
        setEmail,
        isLoading,
        error,
        success,
        handleSubmit,
        resetSuccess,
    } = useForgotPassword();

    if (success) {
        return (
            <AuthLayout>
                <ForgotPasswordSuccess email={email} onTryAgain={resetSuccess} />
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <ForgotPasswordHeader />
            <ForgotPasswordForm
                email={email}
                isLoading={isLoading}
                error={error}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
            />
            <ForgotPasswordFooter />
        </AuthLayout>
    );
}
