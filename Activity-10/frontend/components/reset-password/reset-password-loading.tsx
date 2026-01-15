"use client";

import { Loader2 } from "lucide-react";

export function ResetPasswordLoading() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-neutral-500 dark:text-white/50" />
            <p className="mt-4 text-neutral-600 dark:text-white/70">
                Verifying reset link...
            </p>
        </div>
    );
}

