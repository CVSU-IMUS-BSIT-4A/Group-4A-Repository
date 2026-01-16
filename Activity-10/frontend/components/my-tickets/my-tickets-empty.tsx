"use client";

import { Ticket } from "lucide-react";
import Link from "next/link";

export function MyTicketsEmpty() {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-14 text-center dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900">
                <Ticket className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No tickets yet
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm">
                You haven&apos;t joined any events yet. Browse events and join to get your tickets!
            </p>
            <Link
                href="/my-events"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
                Browse Events
            </Link>
        </div>
    );
}

