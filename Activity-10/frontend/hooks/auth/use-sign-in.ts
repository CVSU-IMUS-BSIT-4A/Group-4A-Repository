"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuthRedirect } from "./use-auth-redirect";

export function useSignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { router } = useAuthRedirect();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError("Email address must be valid format");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        setIsLoading(true);

        try {
            const response = await login(email, password);

            // Store user data in localStorage
            const userData = {
                id: response.data.uid.toString(),
                email: response.data.email,
                firstName: response.data.first_name,
                lastName: response.data.last_name,
                role: response.data.role,
                gender: response.data.gender,
                dob: response.data.dob,
            };

            localStorage.setItem("user", JSON.stringify(userData));

            // Redirect based on role
            if (response.data.role === "admin") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Login failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleSubmit,
    };
}

