"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

/**
 * Component to fix autofill styling issues in dark mode
 * This runs JavaScript to force apply styles after browser autofill
 */
export function AutofillFix() {
    const { theme } = useTheme();
    const isProcessingRef = useRef(false);

    useEffect(() => {
        if (theme !== "dark") return;

        const fixAutofillStyles = () => {
            // Prevent infinite loops
            if (isProcessingRef.current) return;
            isProcessingRef.current = true;

            try {
                // Find all autofilled inputs using a safer method
                const inputs = document.querySelectorAll('input');
                
                inputs.forEach((input) => {
                    const element = input as HTMLInputElement;
                    
                    // Check if the input has autofill by checking computed styles
                    // This is safer than using :-webkit-autofill selector directly
                    try {
                        const computedStyle = window.getComputedStyle(element);
                        const bgImage = computedStyle.getPropertyValue('background-image');
                        
                        // Chrome/Safari adds a background-image for autofill
                        if (bgImage && bgImage.includes('internal-autofill')) {
                            element.classList.add('autofill-dark-fix');
                        }
                    } catch {
                        // Ignore errors from getComputedStyle
                    }
                });
            } finally {
                // Reset the flag after a short delay
                setTimeout(() => {
                    isProcessingRef.current = false;
                }, 50);
            }
        };

        // Run after delays to catch autofills
        const timeout1 = setTimeout(fixAutofillStyles, 100);
        const timeout2 = setTimeout(fixAutofillStyles, 500);
        const timeout3 = setTimeout(fixAutofillStyles, 1500);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    }, [theme]);

    return null;
}

