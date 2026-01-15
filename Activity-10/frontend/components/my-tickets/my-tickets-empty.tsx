"use client";

import { Ticket } from "lucide-react";
import Link from "next/link";

export function MyTicketsEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                <Ticket className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No tickets yet
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center max-w-sm">
                You haven&apos;t joined any events yet. Browse events and join to get your tickets!
            </p>
            <Link
                href="/my-events"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
                Browse Events
            </Link>
        </div>
    );
}

