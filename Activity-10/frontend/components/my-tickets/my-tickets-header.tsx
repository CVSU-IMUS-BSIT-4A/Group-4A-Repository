"use client";

import { Ticket } from "lucide-react";

export function MyTicketsHeader() {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-neutral-900 dark:bg-white">
                    <Ticket className="w-5 h-5 text-white dark:text-neutral-900" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                    My Tickets
                </h1>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
                View and manage all your event tickets
            </p>
        </div>
    );
}

