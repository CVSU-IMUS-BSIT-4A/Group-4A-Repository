"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Convert pathname to readable page name
const getPageName = (pathname: string): string => {
    if (pathname === "/") {
        return "Occasio";
    }

    // Remove leading slash and split by path segments
    const segments = pathname.split("/").filter(Boolean);
    
    // Convert each segment to title case
    const pageName = segments
        .map(segment => {
            // Handle special cases
            const specialCases: Record<string, string> = {
                signin: "Sign In",
                signup: "Sign Up",
            };
            
            if (specialCases[segment.toLowerCase()]) {
                return specialCases[segment.toLowerCase()];
            }
            
            // Convert kebab-case or snake_case to Title Case
            return segment
                .split(/[-_]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        })
        .join(" - ");

    return `${pageName} - Occasio`;
};

export function DynamicTitle() {
    const pathname = usePathname();

    useEffect(() => {
        // Skip dynamic title for event pages - they set their own title with event name
        if (pathname.startsWith("/event/") && pathname !== "/event") {
            return;
        }

        const expectedTitle = getPageName(pathname);
        
        // Function to force update title
        const updateTitle = () => {
            if (document.title !== expectedTitle) {
                document.title = expectedTitle;
            }
        };

        // Update immediately
        updateTitle();
        
        // Update after multiple delays to catch any late metadata updates
        const timeouts = [
            setTimeout(updateTitle, 0),
            setTimeout(updateTitle, 10),
            setTimeout(updateTitle, 50),
            setTimeout(updateTitle, 100),
            setTimeout(updateTitle, 200),
        ];
        
        // Use MutationObserver to watch for title changes and override
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const observer = new MutationObserver(() => {
                updateTitle();
            });

            observer.observe(titleElement, {
                childList: true,
                subtree: true,
                characterData: true,
            });

            return () => {
                timeouts.forEach(id => clearTimeout(id));
                observer.disconnect();
            };
        }
        
        return () => {
            timeouts.forEach(id => clearTimeout(id));
        };
    }, [pathname]);

    return null;
}

