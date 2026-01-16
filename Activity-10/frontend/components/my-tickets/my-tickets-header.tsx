"use client";

import { Ticket } from "lucide-react";

export function MyTicketsHeader() {
    return (
        <div className="mb-6 space-y-2">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Ticket className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                        Ticket vault
                    </p>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        My Tickets
                    </h1>
                </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Access your QR codes and registration details.
            </p>
        </div>
    );
}

