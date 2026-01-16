"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CalendarCheck, QrCode, ShieldCheck } from "lucide-react";

export function AuthBranding() {
    return (
        <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-neutral-950 md:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
            <motion.div
                className="relative z-10 max-w-md space-y-8 px-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Link href="/" className="flex items-center gap-3 text-white">
                    <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 shadow-lg shadow-emerald-500/30" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                            VenueFlow
                        </p>
                        <p className="text-xl font-semibold">Check-in Suite</p>
                    </div>
                </Link>

                <div className="space-y-3">
                    <h2 className="text-3xl font-semibold leading-tight">
                        Event registration and QR access control, unified.
                    </h2>
                    <p className="text-sm text-white/70">
                        Keep registration, ticketing, and entry scanning in one streamlined workflow.
                    </p>
                </div>

                <div className="space-y-3 text-sm text-white/70">
                    <div className="flex items-center gap-3">
                        <CalendarCheck className="h-5 w-5 text-emerald-400" />
                        Create and publish events instantly.
                    </div>
                    <div className="flex items-center gap-3">
                        <QrCode className="h-5 w-5 text-emerald-400" />
                        Issue QR tickets with every registration.
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        Verify entries at the venue in seconds.
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

