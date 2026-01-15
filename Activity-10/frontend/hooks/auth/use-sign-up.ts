"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/lib/password-validator";
import { sendOtp, verifyOtp, register } from "@/lib/api";
import { useAuthRedirect } from "./use-auth-redirect";

export function useSignUp() {
    const [individualStep, setIndividualStep] = useState<1 | 2 | 3>(1);

    // Step 1: Email & Password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Step 2: OTP
    const [otpCode, setOtpCode] = useState<string[]>(["", "", "", "", "", ""]);
    const [resendTimer, setResendTimer] = useState(0);
    const otpInputRefs = useRef<Array<HTMLInputElement | null>>([
        null,
        null,
        null,
        null,
        null,
        null,
    ]);

    // Step 3: Personal Info
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState<
        "male" | "female" | "other" | "prefer-not-to-say" | ""
    >("");
    const [birthdate, setBirthdate] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { router } = useAuthRedirect();

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Step 1: Handle email/password submission
    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError("Email address must be valid format");
            return;
        }

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
            await sendOtp(email);
            setResendTimer(60);
            setIndividualStep(2);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to send OTP. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const otpString = otpCode.join("");
        if (otpString.length !== 6) {
            setError("Please enter a valid 6-digit OTP code");
            return;
        }

        setIsLoading(true);
        try {
            await verifyOtp(email, otpString);
            setIndividualStep(3);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Invalid OTP code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP input change
    const handleOtpChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otpCode];
        newOtp[index] = value;
        setOtpCode(newOtp);

        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    // Handle OTP backspace
    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otpCode[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otpCode];

        for (let i = 0; i < 6; i++) {
            newOtp[i] = pastedData[i] || "";
        }

        setOtpCode(newOtp);
        const nextIndex = Math.min(pastedData.length, 5);
        otpInputRefs.current[nextIndex]?.focus();
    };

    // Step 3: Complete signup
    const handleStep3Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!firstName.trim() || !lastName.trim()) {
            setError("First name and last name are required");
            return;
        }

        setIsLoading(true);
        try {
            await register(
                email,
                password,
                firstName.trim(),
                lastName.trim(),
                gender || undefined,
                birthdate || undefined
            );
            router.push(`/signup/success?email=${encodeURIComponent(email)}`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Registration failed. Please try again."
            );
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setError("");
        setIsLoading(true);
        try {
            await sendOtp(email);
            setResendTimer(60);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to resend OTP. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // Step state
        individualStep,
        // Step 1 state
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        // Step 2 state
        otpCode,
        resendTimer,
        otpInputRefs,
        // Step 3 state
        firstName,
        setFirstName,
        lastName,
        setLastName,
        gender,
        setGender,
        birthdate,
        setBirthdate,
        // Common state
        isLoading,
        error,
        // Handlers
        handleStep1Submit,
        handleStep2Submit,
        handleStep3Submit,
        handleOtpChange,
        handleOtpKeyDown,
        handleOtpPaste,
        handleResendOtp,
    };
}

