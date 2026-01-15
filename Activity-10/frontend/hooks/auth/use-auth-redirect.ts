"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useAuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData) as { role?: string };
                if (parsedUser.role === "admin") {
                    router.push("/dashboard");
                } else {
                    router.push("/");
                }
            }
        } catch (error) {
            console.error("Error reading user data:", error);
        }
    }, [router]);

    return { router };
}

