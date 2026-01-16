"use client";

import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Ticket, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserTicket } from "@/lib/api";
import { useState } from "react";
import { EventTicketModal } from "@/components/event/event-ticket-modal";

interface MyTicketCardProps {
    ticket: UserTicket;
    index: number;
    formatDate: (date: string | Date) => string;
    formatTime: (time: string) => string;
    userName: string;
}

const STATUS_STYLES = {
    upcoming: {
        bg: "bg-emerald-50 dark:bg-emerald-900/30",
        text: "text-emerald-600 dark:text-emerald-400",
        label: "Upcoming",
    },
    ongoing: {
        bg: "bg-sky-50 dark:bg-blue-900/30",
        text: "text-sky-600 dark:text-blue-400",
        label: "Ongoing",
    },
    completed: {
        bg: "bg-neutral-100 dark:bg-neutral-800",
        text: "text-neutral-600 dark:text-neutral-300",
        label: "Completed",
    },
    cancelled: {
        bg: "bg-red-50 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        label: "Cancelled",
    },
};

export function MyTicketCard({
    ticket,
    index,
    formatDate,
    formatTime,
    userName,
}: MyTicketCardProps) {
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const status = STATUS_STYLES[ticket.status];

    const formatDateForModal = (date: string | Date) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
                {/* Image */}
                {ticket.image && (
                    <Link href={`/event/${ticket.eventId}`}>
                        <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800">
                            <Image
                                src={ticket.image}
                                alt={ticket.eventTitle}
                                fill
                                className="object-cover"
                                unoptimized={ticket.image.includes('localhost')}
                            />
                        </div>
                    </Link>
                )}

                {/* Content */}
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${status.bg} ${status.text}`}
                                >
                                    {status.label}
                                </span>
                                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                                    {ticket.category}
                                </span>
                            </div>
                            <Link href={`/event/${ticket.eventId}`}>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-2 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                                    {ticket.eventTitle}
                                </h3>
                            </Link>
                        </div>
                    </div>

                    {/* Ticket Code */}
                    <div className="mb-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                        <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            <span className="uppercase tracking-wider">Ticket</span>
                            <span className="ml-auto font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                                {ticket.ticketCode}
                            </span>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>{formatDate(ticket.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>
                                {formatTime(ticket.eventTime)}
                                {ticket.endTime && ` - ${formatTime(ticket.endTime)}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="line-clamp-1">{ticket.location}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={() => setIsTicketModalOpen(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                        <Download className="h-4 w-4" />
                        View QR ticket
                    </button>
                </div>
            </motion.div>

            {/* Ticket Modal */}
            <EventTicketModal
                isOpen={isTicketModalOpen}
                onClose={() => setIsTicketModalOpen(false)}
                ticket={{
                    ticketCode: ticket.ticketCode,
                    qrCode: ticket.qrCode,
                    eventTitle: ticket.eventTitle,
                    eventDate: ticket.eventDate,
                    eventTime: ticket.eventTime,
                    location: ticket.location,
                    status: ticket.status,
                    registeredAt: ticket.registeredAt,
                }}
                userName={userName}
                formatDate={formatDateForModal}
                formatTime={formatTime}
            />
        </>
    );
}

