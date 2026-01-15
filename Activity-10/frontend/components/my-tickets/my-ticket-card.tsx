"use client";

import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Tag, Ticket, Download } from "lucide-react";
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
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        label: "Upcoming",
    },
    ongoing: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "Ongoing",
    },
    completed: {
        bg: "bg-neutral-100 dark:bg-neutral-800",
        text: "text-neutral-600 dark:text-neutral-400",
        label: "Completed",
    },
    cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
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
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200"
            >
                {/* Image */}
                {ticket.image && (
                    <Link href={`/event/${ticket.eventId}`}>
                        <div className="relative w-full h-48 bg-neutral-100 dark:bg-neutral-800">
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
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                                >
                                    {status.label}
                                </span>
                                <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400">
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
                    <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                Ticket Code:
                            </span>
                            <span className="text-sm font-mono font-semibold text-neutral-900 dark:text-white">
                                {ticket.ticketCode}
                            </span>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>{formatDate(ticket.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span>
                                {formatTime(ticket.eventTime)}
                                {ticket.endTime && ` - ${formatTime(ticket.endTime)}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="line-clamp-1">{ticket.location}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={() => setIsTicketModalOpen(true)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        View Ticket
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

