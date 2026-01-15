"use client";

import { cn } from "@/lib/utils";

interface OrganizationToggleProps {
    showCreateOrg: boolean;
    hasPendingOrganization: boolean;
    onToggle: (showCreate: boolean) => void;
}

export function OrganizationToggle({
    showCreateOrg,
    hasPendingOrganization,
    onToggle,
}: OrganizationToggleProps) {
    return (
        <div className="flex gap-2 mb-4">
            <button
                type="button"
                onClick={() => onToggle(false)}
                className={cn(
                    "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    !showCreateOrg
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                )}
            >
                Select Existing
            </button>
            <button
                type="button"
                onClick={() => {
                    if (!hasPendingOrganization) {
                        onToggle(true);
                    }
                }}
                disabled={hasPendingOrganization}
                className={cn(
                    "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    hasPendingOrganization
                        ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50"
                        : showCreateOrg
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                )}
            >
                Create New
            </button>
        </div>
    );
}

