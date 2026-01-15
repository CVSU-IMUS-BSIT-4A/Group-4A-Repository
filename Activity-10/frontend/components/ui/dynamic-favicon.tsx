"use client";

import { useEffect, useState } from "react";

export function DynamicFavicon() {
    const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

    // Listen to system theme changes
    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        // Set initial system theme
        const updateTheme = () => {
            setSystemTheme(mediaQuery.matches ? "dark" : "light");
        };
        
        updateTheme();

        // Listen for system theme changes
        const handleChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? "dark" : "light");
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    // Update favicon based on system theme
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Remove all existing favicon links (including those with media queries)
        const existingLinks = document.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach(link => link.remove());

        // Set favicon based on system theme
        const faviconPath = systemTheme === "dark" ? "/whitelogo.png" : "/blacklogo.png";
        
        // Create new favicon link with timestamp to prevent caching
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = `${faviconPath}?v=${Date.now()}`;
        
        document.head.appendChild(link);

        // Also update apple-touch-icon if it exists
        const appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
        if (appleIcon) {
            appleIcon.href = `${faviconPath}?v=${Date.now()}`;
        }
    }, [systemTheme]);

    return null;
}

