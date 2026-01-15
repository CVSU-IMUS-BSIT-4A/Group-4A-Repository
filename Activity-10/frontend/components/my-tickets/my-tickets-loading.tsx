"use client";

import { Loader2 } from "lucide-react";

export function MyTicketsLoading() {
    return (
        <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
    );
}

