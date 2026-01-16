"use client";

import { AuthBranding } from "./auth-branding";
import { AuthFormContainer } from "./auth-form-container";
import { AutofillFix } from "@/components/autofill-fix";

interface AuthLayoutProps {
    children: React.ReactNode;
    showThemeToggle?: boolean;
    themeTogglePosition?: "top-left" | "top-right";
}

export function AuthLayout({ 
    children, 
    showThemeToggle = true,
    themeTogglePosition = "top-right"
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-neutral-950 text-white">
            <AutofillFix />
            <div className="min-h-screen flex">
                <AuthBranding />
                <AuthFormContainer
                    showThemeToggle={showThemeToggle}
                    themeTogglePosition={themeTogglePosition}
                >
                    {children}
                </AuthFormContainer>
            </div>
        </div>
    );
}

