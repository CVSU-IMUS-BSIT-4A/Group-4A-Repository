"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function useSignUpSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    useEffect(() => {
        // Redirect to sign in after 5 seconds if user doesn't click
        const timer = setTimeout(() => {
            router.push("/signin");
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return { email };
}

