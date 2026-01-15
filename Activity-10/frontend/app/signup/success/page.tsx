"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpSuccessContent } from "@/components/signup/signup-success-content";
import { useSignUpSuccess } from "@/hooks/auth/use-signup-success";

function SignUpSuccessPageContent() {
    const { email } = useSignUpSuccess();

    return (
        <AuthLayout>
            <SignUpSuccessContent email={email} />
        </AuthLayout>
    );
}

export default function SignUpSuccessPage() {
    return (
        <Suspense
            fallback={
                <AuthLayout>
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-neutral-500 dark:text-white/50" />
                        <p className="mt-4 text-neutral-600 dark:text-white/70">Loading...</p>
                    </div>
                </AuthLayout>
            }
        >
            <SignUpSuccessPageContent />
        </Suspense>
    );
}
