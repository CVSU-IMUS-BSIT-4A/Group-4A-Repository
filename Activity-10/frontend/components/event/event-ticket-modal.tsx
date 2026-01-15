"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Download, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import Image from "next/image";

interface TicketData {
    ticketCode: string;
    qrCode: string;
    eventTitle: string;
    eventDate: string | Date;
    eventTime: string;
    location: string;
    status: string;
    registeredAt: string | Date;
}

interface EventTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: TicketData | null;
    userName: string;
    formatDate: (date: string | Date) => string;
    formatTime: (time: string) => string;
}

export function EventTicketModal({
    isOpen,
    onClose,
    ticket,
    userName,
    formatDate,
    formatTime,
}: EventTicketModalProps) {
    if (!ticket) return null;

    const handleDownload = () => {
        // Create a link to download the QR code
        const link = document.createElement("a");
        link.href = ticket.qrCode;
        link.download = `ticket-${ticket.ticketCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        {/* Ticket Header */}
                        <div className="relative bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 p-4 sm:p-6 text-white">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                            >
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pr-8">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 shrink-0">
                                    <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-white/60 uppercase tracking-wider">
                                        Event Ticket
                                    </p>
                                    <p className="text-xs sm:text-sm font-mono text-white/80 break-all">
                                        {ticket.ticketCode}
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-base sm:text-xl font-bold mb-1 line-clamp-2 pr-8">
                                {ticket.eventTitle}
                            </h2>
                            <p className="text-xs sm:text-sm text-white/70">
                                Attendee: {userName}
                            </p>
                        </div>

                        {/* Ticket Tear Line */}
                        <div className="relative h-4 sm:h-6 bg-white dark:bg-neutral-900">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-4 sm:h-6 bg-neutral-100 dark:bg-neutral-950 rounded-r-full" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-4 sm:h-6 bg-neutral-100 dark:bg-neutral-950 rounded-l-full" />
                            <div className="absolute left-4 sm:left-6 right-4 sm:right-6 top-1/2 border-t-2 border-dashed border-neutral-200 dark:border-neutral-700" />
                        </div>

                        {/* QR Code Section */}
                        <div className="p-4 sm:p-6 flex flex-col items-center">
                            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                                <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                                    <Image
                                        src={ticket.qrCode}
                                        alt="Ticket QR Code"
                                        fill
                                        className="rounded-lg object-contain"
                                        unoptimized
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 sm:mt-3 text-center px-2">
                                Scan this QR code at the event entrance
                            </p>
                        </div>

                        {/* Event Details */}
                        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0 mt-0.5" />
                                    <span className="text-neutral-600 dark:text-neutral-400 wrap-break-word">
                                        {formatDate(ticket.eventDate)}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0 mt-0.5" />
                                    <span className="text-neutral-600 dark:text-neutral-400 wrap-break-word">
                                        {formatTime(ticket.eventTime)}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0 mt-0.5" />
                                    <span className="text-neutral-600 dark:text-neutral-400 wrap-break-word">
                                        {ticket.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 sm:p-6 pt-2 flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs sm:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                            >
                                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">Download QR</span>
                                <span className="xs:hidden">Download</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 sm:py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs sm:text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

