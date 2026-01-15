"use client";

import { AlertCircle } from "lucide-react";
import { type Organization } from "@/lib/api";

interface PendingOrganizationWarningProps {
    pendingOrganization: Organization;
}

export function PendingOrganizationWarning({ pendingOrganization }: PendingOrganizationWarningProps) {
    return (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                    Organization Pending Verification
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                    You have a pending organization &quot;<strong>{pendingOrganization.name}</strong>&quot; waiting for admin verification. Please wait for the verification result before creating another organization. You can still create events with your approved organizations.
                </p>
            </div>
        </div>
    );
}

