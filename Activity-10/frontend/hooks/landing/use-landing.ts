"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useLanding() {
    const [showLogo, setShowLogo] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // Alternate between text and logo every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setShowLogo((prev) => !prev);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Check if user is logged in
    useEffect(() => {
        const checkUser = () => {
            try {
                const userData = localStorage.getItem("user");
                setIsLoggedIn(!!userData);
            } catch {
                setIsLoggedIn(false);
            }
        };

        checkUser();
        window.addEventListener("storage", checkUser);

        return () => {
            window.removeEventListener("storage", checkUser);
        };
    }, []);

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        section?.scrollIntoView({ behavior: "smooth" });
    };

    const handleGetStarted = () => {
        // Check if user is logged in
        try {
            const userData = localStorage.getItem("user");
            if (userData) {
                // User is logged in - redirect to my-events with organize modal open
                router.push("/my-events?openOrganize=true&tab=organized");
            } else {
                // User is not logged in - redirect to signin
                router.push("/signin");
            }
        } catch {
            // If there's an error, redirect to signin
            router.push("/signin");
        }
    };

    return {
        showLogo,
        isLoggedIn,
        scrollToSection,
        handleGetStarted,
    };
}

