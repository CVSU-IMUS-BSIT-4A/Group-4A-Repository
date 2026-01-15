"use client";

import { BeamsBackground } from "@/components/ui/beams-background";
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
        <div className="relative min-h-screen w-full">
            <AutofillFix />
            <BeamsBackground hideContent={true} />
            
            <div className="relative z-10 min-h-screen flex">
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

