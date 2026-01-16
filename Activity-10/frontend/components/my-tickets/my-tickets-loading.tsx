"use client";

import { Loader2 } from "lucide-react";

export function MyTicketsLoading() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        </div>
    );
}

