"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInHeader, SignInForm, SignInFooter } from "@/components/signin";
import { useSignIn } from "@/hooks/auth/use-sign-in";

export default function SignInPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleSubmit,
    } = useSignIn();

    return (
        <AuthLayout>
            <SignInHeader />
            <SignInForm
                email={email}
                password={password}
                isLoading={isLoading}
                error={error}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSubmit}
            />
            <SignInFooter />
        </AuthLayout>
    );
}
